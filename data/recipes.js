const RECIPE_DATABASE = [
    {
        id: 1,
        name: "Chicken Adobo",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/adobo.jpg",
        servings: 4,
        estimatedCost: 320,
        prepTime: "15 mins",
        cookTime: "45 mins",
        difficulty: "Easy",
        ingredients: [
            "1 kg Chicken",
            "1/2 cup Soy Sauce",
            "1/3 cup Vinegar",
            "6 cloves Garlic",
            "2 Bay Leaves",
            "1 tsp Peppercorn"
        ],
        instructions: [
            "Marinate chicken in soy sauce and garlic for 30 minutes.",
            "Brown garlic.",
            "Cook chicken until lightly browned.",
            "Add vinegar and bay leaves.",
            "Simmer for 35 minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 2,
        name: "Tinolang Manok",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "protein"],
        image: "assets/recipes/tinola.jpg",
        servings: 5,
        estimatedCost: 360,
        prepTime: "20 mins",
        cookTime: "40 mins",
        difficulty: "Easy",
        ingredients: [
            "Chicken",
            "Papaya",
            "Malunggay",
            "Ginger",
            "Onion",
            "Fish Sauce"
        ],
        instructions: [
            "Saute ginger and onion.",
            "Add chicken.",
            "Pour water.",
            "Simmer.",
            "Add papaya.",
            "Add malunggay before serving."
        ]
    },
    {
        id: 3,
        name: "Champorado",
        mealType: ["Breakfast"],
        diet: ["anything", "healthy"],
        image: "assets/recipes/champorado.jpg",
        servings: 4,
        estimatedCost: 150,
        prepTime: "10 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "Rice",
            "Tablea",
            "Sugar",
            "Milk"
        ],
        instructions: [
            "Cook rice.",
            "Add tablea.",
            "Mix sugar.",
            "Top with milk."
        ]
    },
    {
        id: 4,
        name: "Pansit Canton",
        mealType: ["Lunch"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/pansit.jpg",
        servings: 4,
        estimatedCost: 120,
        prepTime: "15 mins",
        cookTime: "25 mins",
        difficulty: "Medium",
        ingredients: [
            "Pansit Canton noodles",
            "Mixed vegetables",
            "Soy Sauce",
            "Garlic",
            "Onion",
            "Chicken broth"
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add vegetables and cook until tender.",
            "Pour in broth and soy sauce.",
            "Add noodles and simmer until cooked."
        ]
    },
    {
        id: 5,
        name: "Tortang Talong",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy", "nopork"],
        image: "assets/recipes/tortang-talong.jpg",
        servings: 3,
        estimatedCost: 80,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "2 Eggplants",
            "2 Eggs",
            "Onion",
            "Tomato",
            "Salt",
            "Pepper"
        ],
        instructions: [
            "Grill the eggplants until soft.",
            "Peel, flatten, and coat with beaten egg.",
            "Pan-fry until golden brown.",
            "Serve with rice."
        ]
    },
    {
        id: 6,
        name: "Bangsilog",
        mealType: ["Breakfast"],
        diet: ["anything", "protein"],
        image: "assets/recipes/bangsilog.jpg",
        servings: 3,
        estimatedCost: 170,
        prepTime: "10 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "Daing na Bangus",
            "Rice",
            "Eggs",
            "Garlic",
            "Tomato"
        ],
        instructions: [
            "Marinate bangus in vinegar and garlic.",
            "Fry the fish until crisp.",
            "Cook rice and fry eggs.",
            "Serve with tomatoes."
        ]
    },
    {
        id: 7,
        name: "Ginisang Monggo",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid"],
        image: "assets/recipes/monggo.jpg",
        servings: 4,
        estimatedCost: 95,
        prepTime: "15 mins",
        cookTime: "40 mins",
        difficulty: "Easy",
        ingredients: [
            "Mung beans",
            "Garlic",
            "Onion",
            "Tomato",
            "Spinach",
            "Pork or tinapa"
        ],
        instructions: [
            "Boil mung beans until soft.",
            "Sauté garlic, onion, and tomato.",
            "Add mung beans and simmer.",
            "Stir in spinach before serving."
        ]
    },
    {
        id: 9,
        name: "Pritong Tokwa",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy", "nopork"],
        image: "assets/recipes/tokwa.jpg",
        servings: 3,
        estimatedCost: 70,
        prepTime: "10 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "Tofu",
            "Cornstarch",
            "Oil",
            "Soy sauce",
            "Vinegar",
            "Chili"
        ],
        instructions: [
            "Slice tofu and coat with cornstarch.",
            "Fry until crisp.",
            "Mix soy sauce, vinegar, and chili for dip.",
            "Serve with rice."
        ]
    },
    {
        id: 10,
        name: "Adobong Tokwa",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein", "healthy", "tipid", "nopork"],
        image: "assets/recipes/adobong-tokwa.jpg",
        servings: 4,
        estimatedCost: 110,
        prepTime: "10 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "500g firm tofu",
            "1/2 cup soy sauce",
            "1/4 cup vinegar",
            "6 cloves garlic",
            "2 bay leaves",
            "1 tsp pepper"
        ],
        instructions: [
            "Fry cubes of tofu until golden brown.",
            "Sauté garlic until fragrant.",
            "Add soy sauce, vinegar, bay leaves, and pepper.",
            "Return tofu to the pan and simmer for 10 minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 11,
        name: "Pinakbet",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/pinakbet.jpg",
        servings: 4,
        estimatedCost: 140,
        prepTime: "15 mins",
        cookTime: "30 mins",
        difficulty: "Medium",
        ingredients: [
            "Bitter melon",
            "Eggplant",
            "Okra",
            "Squash",
            "Tomato",
            "Bagoong"
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add tomato and cook until soft.",
            "Add vegetables and a bit of water.",
            "Simmer until vegetables are tender.",
            "Season with bagoong and serve."
        ]
    },
    {
        id: 12,
        name: "Lugaw with Tokwa't Baboy",
        mealType: ["Breakfast", "Lunch"],
        diet: ["anything", "healthy", "tipid"],
        image: "assets/recipes/lugaw.jpg",
        servings: 4,
        estimatedCost: 85,
        prepTime: "10 mins",
        cookTime: "35 mins",
        difficulty: "Easy",
        ingredients: [
            "Glutinous rice",
            "Garlic",
            "Ginger",
            "Chicken broth",
            "Tofu",
            "Pork belly"
        ],
        instructions: [
            "Toast garlic and ginger.",
            "Add rice and broth, simmer until thick.",
            "Cook pork and tofu separately.",
            "Serve lugaw topped with tokwa't baboy."
        ]
    },
    {
        id: 13,
        name: "Arroz Caldo",
        mealType: ["Breakfast", "Lunch"],
        diet: ["anything", "healthy", "protein"],
        image: "assets/recipes/arroz-caldo.jpg",
        servings: 4,
        estimatedCost: 130,
        prepTime: "15 mins",
        cookTime: "40 mins",
        difficulty: "Easy",
        ingredients: [
            "Rice",
            "Chicken",
            "Ginger",
            "Garlic",
            "Onion",
            "Fish sauce"
        ],
        instructions: [
            "Sauté garlic, onion, and ginger.",
            "Add chicken and rice.",
            "Pour broth and simmer until rice is soft.",
            "Season with fish sauce and serve with boiled egg."
        ]
    },
    {
        id: 14,
        name: "Beef Caldereta",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/caldereta.jpg",
        servings: 4,
        estimatedCost: 280,
        prepTime: "20 mins",
        cookTime: "1 hr",
        difficulty: "Medium",
        ingredients: [
            "Beef chunks",
            "Potato",
            "Carrot",
            "Tomato sauce",
            "Bell pepper",
            "Garlic"
        ],
        instructions: [
            "Sear beef until browned.",
            "Sauté garlic and onion.",
            "Add beef, tomato sauce, and simmer until tender.",
            "Add vegetables and cook until soft."
        ]
    },
    {
        id: 15,
        name: "Sinigang na Baboy",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy"],
        image: "assets/recipes/sinigang-baboy.jpg",
        servings: 5,
        estimatedCost: 260,
        prepTime: "20 mins",
        cookTime: "40 mins",
        difficulty: "Easy",
        ingredients: [
            "Pork",
            "Tamarind",
            "Radish",
            "Kangkong",
            "Tomato",
            "Okra"
        ],
        instructions: [
            "Boil pork until tender.",
            "Add tamarind broth and vegetables.",
            "Simmer until vegetables are cooked.",
            "Serve with rice."
        ]
    },
    {
        id: 16,
        name: "Menudo",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/menudo.jpg",
        servings: 4,
        estimatedCost: 170,
        prepTime: "15 mins",
        cookTime: "45 mins",
        difficulty: "Medium",
        ingredients: [
            "Pork",
            "Liver",
            "Potato",
            "Carrot",
            "Tomato sauce",
            "Garlic"
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add pork and liver and cook until browned.",
            "Add tomato sauce and simmer.",
            "Add vegetables and cook until tender."
        ]
    },
    {
        id: 17,
        name: "Chicken Inasal",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/inasal.jpg",
        servings: 4,
        estimatedCost: 220,
        prepTime: "20 mins",
        cookTime: "30 mins",
        difficulty: "Medium",
        ingredients: [
            "Chicken thighs",
            "Vinegar",
            "Soy sauce",
            "Garlic",
            "Lemon grass",
            "Annatto oil"
        ],
        instructions: [
            "Marinate chicken with spices.",
            "Grill until cooked through.",
            "Baste with annatto oil.",
            "Serve with rice."
        ]
    },
    {
        id: 18,
        name: "Pork BBQ",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/pork-bbq.jpg",
        servings: 4,
        estimatedCost: 240,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "Pork belly",
            "Soy sauce",
            "Brown sugar",
            "Garlic",
            "Banana ketchup",
            "Oil"
        ],
        instructions: [
            "Marinate pork in sauce.",
            "Skewer and grill until charred.",
            "Baste regularly.",
            "Serve with rice."
        ]
    },
    {
        id: 19,
        name: "Adobong Tokwa",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein", "healthy", "tipid", "nopork"],
        image: "assets/recipes/adobong-tokwa.jpg",
        servings: 4,
        estimatedCost: 110,
        prepTime: "10 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "500g firm tofu",
            "1/2 cup soy sauce",
            "1/4 cup vinegar",
            "6 cloves garlic",
            "2 bay leaves",
            "1 tsp pepper"
        ],
        instructions: [
            "Fry cubes of tofu until golden brown.",
            "Sauté garlic until fragrant.",
            "Add soy sauce, vinegar, bay leaves, and pepper.",
            "Return tofu to the pan and simmer for 10 minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 20,
        name: "Bistek Tagalog",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/bistek.jpg",
        servings: 4,
        estimatedCost: 260,
        prepTime: "15 mins",
        cookTime: "25 mins",
        difficulty: "Medium",
        ingredients: [
            "Beef sirloin",
            "Soy sauce",
            "Calamansi juice",
            "Onion",
            "Garlic",
            "Black pepper"
        ],
        instructions: [
            "Marinate beef in soy sauce and calamansi.",
            "Sear beef until browned.",
            "Simmer with onions until tender.",
            "Serve with rice."
        ]
    },
    {
        id: 21,
        name: "Corned Beef Hash",
        mealType: ["Breakfast"],
        diet: ["anything", "protein", "tipid"],
        image: "assets/recipes/corned-beef-hash.jpg",
        servings: 3,
        estimatedCost: 130,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "Canned corned beef",
            "Potato",
            "Onion",
            "Garlic",
            "Oil",
            "Salt"
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add diced potato and cook until soft.",
            "Stir in corned beef and cook until heated through.",
            "Season and serve with rice or bread."
        ]
    },
    {
        id: 22,
        name: "Tapsilog",
        mealType: ["Breakfast"],
        diet: ["anything", "protein"],
        image: "assets/recipes/tapsilog.jpg",
        servings: 3,
        estimatedCost: 180,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "Beef tapa",
            "Rice",
            "Eggs",
            "Garlic",
            "Soy sauce",
            "Calamansi"
        ],
        instructions: [
            "Marinate beef tapa.",
            "Fry beef until cooked.",
            "Cook rice and fry eggs.",
            "Serve with garlic rice and eggs."
        ]
    },
    {
        id: 23,
        name: "Longsilog",
        mealType: ["Breakfast"],
        diet: ["anything", "protein"],
        image: "assets/recipes/longsilog.jpg",
        servings: 3,
        estimatedCost: 160,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "Longganisa",
            "Rice",
            "Eggs",
            "Garlic",
            "Tomato"
        ],
        instructions: [
            "Cook longganisa until browned.",
            "Fry rice with garlic.",
            "Cook eggs sunny-side up.",
            "Serve with tomatoes."
        ]
    },
    {
        id: 24,
        name: "Daing na Bangus",
        mealType: ["Breakfast"],
        diet: ["anything", "protein", "healthy"],
        image: "assets/recipes/daing-bangus.jpg",
        servings: 3,
        estimatedCost: 150,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "Bangus",
            "Vinegar",
            "Garlic",
            "Pepper",
            "Salt",
            "Oil"
        ],
        instructions: [
            "Marinate bangus in vinegar and spices.",
            "Fry until golden brown.",
            "Serve with rice and tomatoes."
        ]
    },
    {
        id: 25,
        name: "Omelette with Tomato",
        mealType: ["Breakfast"],
        diet: ["anything", "healthy", "tipid"],
        image: "assets/recipes/omelette.jpg",
        servings: 2,
        estimatedCost: 80,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "Eggs",
            "Tomato",
            "Onion",
            "Salt",
            "Pepper",
            "Oil"
        ],
        instructions: [
            "Beat eggs and season.",
            "Sauté onion and tomato.",
            "Pour egg mixture and cook until set.",
            "Fold and serve."
        ]
    },
    {
        id: 26,
        name: "Tuyo at Garlic Rice",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/tuoy-rice.jpg",
        servings: 3,
        estimatedCost: 100,
        prepTime: "10 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "Dried fish",
            "Rice",
            "Garlic",
            "Oil",
            "Salt"
        ],
        instructions: [
            "Fry dried fish until crispy.",
            "Saute garlic and mix with rice.",
            "Serve with fish."
        ]
    },
    {
        id: 27,
        name: "Pandesal with Cheese",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/pandesal.jpg",
        servings: 4,
        estimatedCost: 90,
        prepTime: "5 mins",
        cookTime: "0 mins",
        difficulty: "Easy",
        ingredients: [
            "Pandesal",
            "Cheese slices",
            "Butter"
        ],
        instructions: [
            "Slice pandesal.",
            "Insert cheese.",
            "Toast lightly if desired.",
            "Serve warm."
        ]
    },
    {
        id: 28,
        name: "Monggo Guisado",
        mealType: ["Breakfast"],
        diet: ["anything", "healthy"],
        image: "assets/recipes/monggo-breakfast.jpg",
        servings: 4,
        estimatedCost: 95,
        prepTime: "15 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "Mung beans",
            "Garlic",
            "Onion",
            "Tomato",
            "Spinach",
            "Fish sauce"
        ],
        instructions: [
            "Boil mung beans until soft.",
            "Sauté garlic and onion.",
            "Add tomatoes and mung beans.",
            "Stir in spinach before serving."
        ]
    },
    {
        id: 29,
        name: "Taho",
        mealType: ["Breakfast"],
        diet: ["anything", "healthy"],
        image: "assets/recipes/taho.jpg",
        servings: 4,
        estimatedCost: 90,
        prepTime: "5 mins",
        cookTime: "5 mins",
        difficulty: "Easy",
        ingredients: [
            "Soft tofu",
            "Arnibal",
            "Sago pearls"
        ],
        instructions: [
            "Prepare soft tofu.",
            "Add arnibal and sago.",
            "Serve warm."
        ]
    },
    {
        id: 30,
        name: "Leche Flan",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/leche-flan.jpg",
        servings: 4,
        estimatedCost: 120,
        prepTime: "15 mins",
        cookTime: "45 mins",
        difficulty: "Medium",
        ingredients: [
            "Egg yolks",
            "Milk",
            "Condensed milk",
            "Sugar",
            "Vanilla"
        ],
        instructions: [
            "Make caramel sauce.",
            "Mix egg yolks, milk, and condensed milk.",
            "Pour into mold and steam.",
            "Chill before serving."
        ]
    },
    {
        id: 31,
        name: "Kare-Kare",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/kare-kare.jpg",
        servings: 4,
        estimatedCost: 340,
        prepTime: "20 mins",
        cookTime: "1 hr",
        difficulty: "Medium",
        ingredients: [
            "Oxtail",
            "Peanut butter",
            "Banana blossom",
            "Eggplant",
            "Bagoong",
            "Ground rice"
        ],
        instructions: [
            "Boil oxtail until tender.",
            "Sauté garlic and onion.",
            "Add peanut sauce and ground rice.",
            "Add vegetables and simmer."
        ]
    },
    {
        id: 32,
        name: "Kaldereta Tagalog",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/kaldereta.jpg",
        servings: 4,
        estimatedCost: 290,
        prepTime: "20 mins",
        cookTime: "1 hr",
        difficulty: "Medium",
        ingredients: [
            "Beef",
            "Potato",
            "Carrot",
            "Bell pepper",
            "Tomato sauce",
            "Cheese"
        ],
        instructions: [
            "Brown beef.",
            "Add vegetables and tomato sauce.",
            "Simmer until tender.",
            "Add cheese and serve."
        ]
    },
    {
        id: 33,
        name: "Beef Pares",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/pares.jpg",
        servings: 4,
        estimatedCost: 280,
        prepTime: "15 mins",
        cookTime: "45 mins",
        difficulty: "Medium",
        ingredients: [
            "Beef brisket",
            "Soy sauce",
            "Garlic",
            "Onion",
            "Star anise",
            "Brown sugar"
        ],
        instructions: [
            "Sear beef.",
            "Simmer with soy sauce and spices.",
            "Cook until tender.",
            "Serve with garlic rice."
        ]
    },
    {
        id: 34,
        name: "Sotanghon Soup",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy"],
        image: "assets/recipes/sotanghon.jpg",
        servings: 4,
        estimatedCost: 180,
        prepTime: "15 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "Sotanghon noodles",
            "Chicken",
            "Mushrooms",
            "Garlic",
            "Onion",
            "Carrot"
        ],
        instructions: [
            "Cook chicken broth.",
            "Add vegetables and noodles.",
            "Simmer until noodles are tender.",
            "Serve hot."
        ]
    },
    {
        id: 35,
        name: "Pininyahang Manok",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "protein"],
        image: "assets/recipes/pininyahang-manok.jpg",
        servings: 4,
        estimatedCost: 220,
        prepTime: "20 mins",
        cookTime: "35 mins",
        difficulty: "Medium",
        ingredients: [
            "Chicken",
            "Pineapple",
            "Carrots",
            "Bell pepper",
            "Cream",
            "Garlic"
        ],
        instructions: [
            "Sauté garlic and chicken.",
            "Add pineapple and vegetables.",
            "Add cream and simmer.",
            "Serve with rice."
        ]
    },
    {
        id: 36,
        name: "Paksiw na Bangus",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "protein", "nopork"],
        image: "assets/recipes/paksiw-bangus.jpg",
        servings: 4,
        estimatedCost: 190,
        prepTime: "15 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "Bangus",
            "Vinegar",
            "Garlic",
            "Ginger",
            "Soy sauce",
            "Bay leaves"
        ],
        instructions: [
            "Place bangus in a pot.",
            "Add garlic, ginger, vinegar, soy sauce, and bay leaves.",
            "Simmer until fish is cooked.",
            "Serve with rice."
        ]
    },
    {
        id: 37,
        name: "Ginataang Gulay",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/ginataang-gulay.jpg",
        servings: 4,
        estimatedCost: 140,
        prepTime: "15 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "Kangkong",
            "Eggplant",
            "Malunggay",
            "Coconut milk",
            "Garlic",
            "Onion"
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add vegetables and cook briefly.",
            "Pour coconut milk and simmer until vegetables are tender.",
            "Season and serve with rice."
        ]
    },
    {
        id: 38,
        name: "Laing",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/laing.jpg",
        servings: 4,
        estimatedCost: 160,
        prepTime: "15 mins",
        cookTime: "30 mins",
        difficulty: "Medium",
        ingredients: [
            "Dried taro leaves",
            "Coconut milk",
            "Garlic",
            "Onion",
            "Ginger",
            "Shrimp paste"
        ],
        instructions: [
            "Sauté garlic, onion, and ginger.",
            "Add coconut milk and simmer.",
            "Stir in taro leaves and simmer until tender.",
            "Season with shrimp paste and serve." 
        ]
    },
    {
        id: 39,
        name: "Chicken Afritada",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/chicken-afritada.jpg",
        servings: 4,
        estimatedCost: 230,
        prepTime: "20 mins",
        cookTime: "35 mins",
        difficulty: "Medium",
        ingredients: [
            "Chicken",
            "Tomato sauce",
            "Potato",
            "Carrot",
            "Bell pepper",
            "Garlic"
        ],
        instructions: [
            "Sauté garlic until fragrant.",
            "Add chicken and brown lightly.",
            "Add tomato sauce and simmer.",
            "Add vegetables and cook until tender." 
        ]
    },
    {
        id: 40,
        name: "Beef Nilaga",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "protein"],
        image: "assets/recipes/beef-nilaga.jpg",
        servings: 5,
        estimatedCost: 260,
        prepTime: "20 mins",
        cookTime: "1 hr",
        difficulty: "Medium",
        ingredients: [
            "Beef shank",
            "Cabbage",
            "Potato",
            "Corn",
            "Onion",
            "Peppercorn"
        ],
        instructions: [
            "Boil beef until tender.",
            "Add vegetables and cook until soft.",
            "Season with salt and pepper.",
            "Serve hot with rice." 
        ]
    },
    {
        id: 41,
        name: "Pancit Palabok",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/pancit-palabok.jpg",
        servings: 4,
        estimatedCost: 170,
        prepTime: "20 mins",
        cookTime: "25 mins",
        difficulty: "Medium",
        ingredients: [
            "Rice noodles",
            "Shrimp",
            "Smoked fish flakes",
            "Garlic",
            "Annatto oil",
            "Egg" 
        ],
        instructions: [
            "Cook noodles until tender.",
            "Prepare sauce with stock, garlic, and annatto oil.",
            "Top noodles with shrimp, egg, and smoked fish flakes.",
            "Serve with calamansi." 
        ]
    },
    {
        id: 42,
        name: "Crispy Pata",
        mealType: ["Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/crispy-pata.jpg",
        servings: 5,
        estimatedCost: 350,
        prepTime: "30 mins",
        cookTime: "1 hr 30 mins",
        difficulty: "Hard",
        ingredients: [
            "Pork leg",
            "Garlic",
            "Bay leaves",
            "Salt",
            "Pepper",
            "Oil" 
        ],
        instructions: [
            "Boil pork leg until fork-tender.",
            "Dry the skin thoroughly.",
            "Deep-fry until golden and crispy.",
            "Serve with soy-vinegar dipping sauce." 
        ]
    },
    {
        id: 43,
        name: "Bangus Sisig",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein", "nopork"],
        image: "assets/recipes/bangus-sisig.jpg",
        servings: 4,
        estimatedCost: 210,
        prepTime: "20 mins",
        cookTime: "15 mins",
        difficulty: "Medium",
        ingredients: [
            "Bangus belly",
            "Onion",
            "Chili",
            "Calamansi",
            "Mayonnaise",
            "Garlic"
        ],
        instructions: [
            "Fry bangus belly until crispy.",
            "Chop and mix with onions, garlic, chili, and mayonnaise.",
            "Squeeze calamansi before serving.",
            "Serve on a sizzling plate." 
        ]
    },
    {
        id: 44,
        name: "Pork Sinigang sa Sampalok",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy"],
        image: "assets/recipes/pork-sinigang.jpg",
        servings: 5,
        estimatedCost: 240,
        prepTime: "20 mins",
        cookTime: "40 mins",
        difficulty: "Easy",
        ingredients: [
            "Pork",
            "Tamarind broth mix",
            "Radish",
            "Sitaw",
            "Kangkong",
            "Tomato"
        ],
        instructions: [
            "Boil pork until tender.",
            "Add tamarind broth and vegetables.",
            "Simmer until vegetables are cooked.",
            "Serve with rice." 
        ]
    },
    {
        id: 45,
        name: "Inihaw na Liempo",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/inihaw-liempo.jpg",
        servings: 4,
        estimatedCost: 240,
        prepTime: "15 mins",
        cookTime: "25 mins",
        difficulty: "Medium",
        ingredients: [
            "Pork belly",
            "Soy sauce",
            "Calamansi",
            "Garlic",
            "Brown sugar",
            "Oil" 
        ],
        instructions: [
            "Marinate pork belly.",
            "Grill until cooked and slightly charred.",
            "Baste with marinade while grilling.",
            "Serve with rice and atchara." 
        ]
    },
    {
        id: 46,
        name: "Ginisang Sayote with Shrimp",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy"],
        image: "assets/recipes/sayote-shrimp.jpg",
        servings: 4,
        estimatedCost: 160,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "Sayote",
            "Shrimp",
            "Garlic",
            "Onion",
            "Tomato",
            "Fish sauce" 
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add shrimp and cook briefly.",
            "Add sayote and tomatoes.",
            "Season and simmer until tender." 
        ]
    },
    {
        id: 47,
        name: "Adobong Pusit",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein", "nopork"],
        image: "assets/recipes/adobong-pusit.jpg",
        servings: 4,
        estimatedCost: 200,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Medium",
        ingredients: [
            "Squid",
            "Soy sauce",
            "Vinegar",
            "Garlic",
            "Onion",
            "Black pepper" 
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add squid and cook until firm.",
            "Add soy sauce and vinegar.",
            "Simmer until sauce thickens." 
        ]
    },
    {
        id: 48,
        name: "Gising-Gising",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/gising-gising.jpg",
        servings: 4,
        estimatedCost: 130,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "Winged beans",
            "Coconut milk",
            "Ground pork or tofu",
            "Garlic",
            "Onion",
            "Chili" 
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add ground pork or tofu.",
            "Stir in vegetables and coconut milk.",
            "Simmer until cooked." 
        ]
    },
    {
        id: 49,
        name: "Tinapa Fried Rice",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein", "tipid"],
        image: "assets/recipes/tinapa-fried-rice.jpg",
        servings: 4,
        estimatedCost: 120,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "Leftover rice",
            "Tinapa flakes",
            "Garlic",
            "Eggs",
            "Spring onion",
            "Soy sauce" 
        ],
        instructions: [
            "Sauté garlic until fragrant.",
            "Add tinapa flakes.",
            "Stir in rice and season.",
            "Make a well for eggs and scramble them together." 
        ]
    },
    {
        id: 50,
        name: "Sotong at Gulay",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "nopork"],
        image: "assets/recipes/sotong-gulay.jpg",
        servings: 4,
        estimatedCost: 180,
        prepTime: "15 mins",
        cookTime: "25 mins",
        difficulty: "Medium",
        ingredients: [
            "Squid",
            "Bok choy",
            "Garlic",
            "Onion",
            "Tomato",
            "Fish sauce" 
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add squid and cook briefly.",
            "Add vegetables and cook until tender.",
            "Season with fish sauce." 
        ]
    },
    {
        id: 51,
        name: "Chicken Adobo (1 Pax)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/adobo.jpg",
        servings: 1,
        estimatedCost: 90,
        prepTime: "10 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "250g Chicken",
            "2 tbsp Soy Sauce",
            "1 tbsp Vinegar",
            "3 cloves Garlic",
            "1 Bay Leaf",
            "Pepper"
        ],
        instructions: [
            "Marinate chicken in soy sauce and garlic.",
            "Brown garlic and sear the chicken.",
            "Add vinegar and bay leaf, simmer until cooked.",
            "Serve with rice."
        ]
    },
    {
        id: 52,
        name: "Chicken Adobo (2 Pax)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/adobo.jpg",
        servings: 2,
        estimatedCost: 170,
        prepTime: "10 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "500g Chicken",
            "1/4 cup Soy Sauce",
            "2 tbsp Vinegar",
            "5 cloves Garlic",
            "2 Bay Leaves",
            "Pepper"
        ],
        instructions: [
            "Marinate chicken in soy sauce and garlic.",
            "Brown garlic and sear the chicken.",
            "Add vinegar and bay leaves, simmer until cooked.",
            "Serve with rice."
        ]
    },
    {
        id: 53,
        name: "Chicken Adobo (3 Pax)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/adobo.jpg",
        servings: 3,
        estimatedCost: 240,
        prepTime: "10 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "750g Chicken",
            "1/3 cup Soy Sauce",
            "3 tbsp Vinegar",
            "6 cloves Garlic",
            "2 Bay Leaves",
            "Pepper"
        ],
        instructions: [
            "Marinate chicken in soy sauce and garlic.",
            "Brown garlic and sear the chicken.",
            "Add vinegar and bay leaves, simmer until cooked.",
            "Serve with rice."
        ]
    },
    {
        id: 54,
        name: "Bangsilog (1 Pax)",
        mealType: ["Breakfast"],
        diet: ["anything", "protein"],
        image: "assets/recipes/bangsilog.jpg",
        servings: 1,
        estimatedCost: 60,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "1 piece Daing na Bangus",
            "1 cup Rice",
            "1 Egg",
            "Garlic",
            "Tomato"
        ],
        instructions: [
            "Marinate bangus in vinegar and garlic.",
            "Fry the fish until crisp.",
            "Cook rice and fry egg.",
            "Serve with tomatoes."
        ]
    },
    {
        id: 55,
        name: "Tapsilog (1 Pax)",
        mealType: ["Breakfast"],
        diet: ["anything", "protein"],
        image: "assets/recipes/tapsilog.jpg",
        servings: 1,
        estimatedCost: 85,
        prepTime: "15 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "100g Beef Tapa",
            "1 cup Rice",
            "1 Egg",
            "Garlic",
            "Calamansi"
        ],
        instructions: [
            "Marinate beef tapa.",
            "Fry beef until cooked.",
            "Cook rice and fry egg.",
            "Serve with garlic rice and egg."
        ]
    },
    {
        id: 56,
        name: "Ginisang Monggo (2 Pax)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid"],
        image: "assets/recipes/monggo.jpg",
        servings: 2,
        estimatedCost: 65,
        prepTime: "15 mins",
        cookTime: "35 mins",
        difficulty: "Easy",
        ingredients: [
            "1 cup Mung beans",
            "Garlic",
            "Onion",
            "Tomato",
            "Spinach",
            "Pork or tinapa"
        ],
        instructions: [
            "Boil mung beans until soft.",
            "Sauté garlic, onion, and tomato.",
            "Add mung beans and simmer.",
            "Stir in spinach before serving." 
        ]
    },
    {
        id: 57,
        name: "Beef Caldereta (2 Pax)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/caldereta.jpg",
        servings: 2,
        estimatedCost: 170,
        prepTime: "20 mins",
        cookTime: "1 hr",
        difficulty: "Medium",
        ingredients: [
            "Beef chunks",
            "Potato",
            "Carrot",
            "Tomato sauce",
            "Bell pepper",
            "Garlic"
        ],
        instructions: [
            "Sear beef until browned.",
            "Sauté garlic and onion.",
            "Add beef, tomato sauce, and simmer until tender.",
            "Add vegetables and cook until soft." 
        ]
    },
    {
        id: 58,
        name: "Pork BBQ (2 Pax)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/pork-bbq.jpg",
        servings: 2,
        estimatedCost: 135,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "Pork belly",
            "Soy sauce",
            "Brown sugar",
            "Garlic",
            "Banana ketchup",
            "Oil"
        ],
        instructions: [
            "Marinate pork in sauce.",
            "Skewer and grill until charred.",
            "Baste regularly.",
            "Serve with rice." 
        ]
    }
];

