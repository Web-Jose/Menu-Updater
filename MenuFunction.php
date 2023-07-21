<?php
add_action('dining_menu_updater', 'update_pods_from_github');
function update_pods_from_github()
{
    // GitHub URL
    $url = 'https://raw.githubusercontent.com/Web-Jose/Menu-Updater/af96865b4ef4eabb64ef42ab0f1b50985aa83621/Menu.json';

    // GitHub Personal Access Token
    $token = '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';

    // Set up the API headers
    $args = array(
        'headers' => array(
            'Authorization' => 'token ' . $token
        )
    );

    // Make the API request
    $response = wp_remote_get($url, $args);

    // Check for errors
    if (is_wp_error($response)) {
        error_log('Error in API request: ' . $response->get_error_message());
        return;
    }

    // Get the JSON from the body of the response
    $json_data = wp_remote_retrieve_body($response);

    // Decode the JSON into an associative array
    $menu_data = json_decode($json_data, true);

    // Check for errors decoding the JSON
    if (is_null($menu_data)) {
        error_log('Error decoding JSON from API');
        return;
    }

    // loop through each day in the menu data
    foreach ($menu_data as $day => $meals) {

        // loop through each meal type (e.g., Breakfast, Lunch, Dinner)
        foreach ($meals as $meal_type => $items) {

            // creating a pod name e.g., sundays_breakfast
            $pod_name = strtolower($day . '_' . $meal_type);

            // Get the pod object
            $pod = pods($pod_name);

            // Check if pod exists
            if (!$pod->exists()) {
                error_log('Pod does not exist: ' . $pod_name);
                continue;
            }

            // Loop through the items for the meal
            foreach ($items as $item) {

                // Get the key (field label) and value (field value) for each item
                foreach ($item as $label => $value) {

                    // Construct the field name e.g., sundays_breakfast_entree
                    $field_name = $pod_name . '_' . strtolower(str_replace(' ', '_', $label));

                    // Check if the field exists
                    if (!$pod->fields($field_name)) {
                        error_log('Field does not exist: ' . $field_name);
                        continue;
                    }

                    // Save the value to the field
                    $data = array(
                        $field_name => $value
                    );

                    // Update the pod
                    $pod->save($data);
                }
            }
        }
    }
}
