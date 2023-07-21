<?php
add_action('dining_menu_updater', 'update_pods_from_github');
function update_pods_from_github()
{
    //Url to JSON file hosted on GitHub: repository Menu-Updater, branch master, file Menu.json
    $url = 'https://raw.githubusercontent.com/Web-Jose/Menu-Updater/af96865b4ef4eabb64ef42ab0f1b50985aa83621/Menu.json';

    // GitHub Personal Access Token
    $token = '1234567890abcdef1234567890abcdef12345678';

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

    // Loop through each day in the menu data (e.g., Sunday, Monday, Tuesday)
    foreach ($menu_data as $day => $meals) {

        // Loop through each meal type (e.g., Breakfast, Lunch, Dinner)
        foreach ($meals as $meal_type => $items) {

            //Loop through each food type (e.g., Entrees, Sides, Desserts)
            foreach ($items as $food_type => $food_items) {

                //Loop Through each food item (e.g., Chicken, Rice, Beans)
                foreach ($food_items as $food => $item) {

                    // Get the Dining Hall Menu Pod
                    $DiningPod = pods('dining_hall_menu');

                    // Check if pod exists
                    if ($DiningPod->exists()) {

                        //Creating the field name
                        $field_name = strtolower($day . 's_' . $meal_type . '_' . str_replace(" ", "_", str_replace("é", "e", $food_type)));

                        // Save the value to the field name
                        $FieldValue = array(
                            $field_name => $item
                        );

                        // Update the pod
                        $DiningPod->save($FieldValue);
                    } else {
                        error_log('Pod does not exist: ' . $DiningPod);
                        continue;
                    }
                }
            }
        }
    }
}
