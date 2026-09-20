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
    },
    {
        id: 59,
        name: "Itlog at Sinangag",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid", "protein"],
        image: "assets/recipes/itlog-sinangag.jpg",
        servings: 2,
        estimatedCost: 45,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "2 pc Egg",
            "2 cup Rice",
            "3 cloves Garlic",
            "2 tbsp Oil",
            "1 tsp Salt"
        ],
        instructions: [
            "Fry garlic in oil until golden.",
            "Add day-old rice and stir-fry with salt.",
            "Fry eggs sunny side up.",
            "Serve eggs on top of garlic rice."
        ]
    },
    {
        id: 60,
        name: "Tortang Itlog with Rice",
        mealType: ["Breakfast", "Dinner"],
        diet: ["anything", "tipid", "protein"],
        image: "assets/recipes/tortang-itlog.jpg",
        servings: 2,
        estimatedCost: 50,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "3 pc Egg",
            "1 pc Onion",
            "1 pc Tomato",
            "2 tbsp Oil",
            "2 cup Rice"
        ],
        instructions: [
            "Beat eggs with chopped onion and tomato.",
            "Pour into a hot oiled pan.",
            "Cook both sides until golden.",
            "Serve with hot rice."
        ]
    },
    {
        id: 61,
        name: "Ginisang Sardinas with Rice",
        mealType: ["Breakfast", "Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginisang-sardinas.jpg",
        servings: 2,
        estimatedCost: 55,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "1 can Sardines",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Oil",
            "2 cup Rice"
        ],
        instructions: [
            "Sauté garlic and onion in oil.",
            "Add sardines with sauce.",
            "Simmer for 5 minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 62,
        name: "Pancit Canton with Itlog",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/canton-itlog.jpg",
        servings: 1,
        estimatedCost: 30,
        prepTime: "2 mins",
        cookTime: "8 mins",
        difficulty: "Easy",
        ingredients: [
            "1 pack Instant Pancit Canton",
            "1 pc Egg",
            "1 tbsp Oil"
        ],
        instructions: [
            "Boil noodles until just tender, then drain.",
            "Mix in the seasoning and oil packets.",
            "Fry egg sunny side up.",
            "Top noodles with the fried egg."
        ]
    },
    {
        id: 63,
        name: "Lugaw na may Itlog",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid", "healthy", "nopork"],
        image: "assets/recipes/lugaw-itlog.jpg",
        servings: 3,
        estimatedCost: 40,
        prepTime: "5 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "1 cup Rice",
            "2 pc Egg",
            "3 cloves Garlic",
            "1 tbsp Fish Sauce",
            "1 tsp Pepper"
        ],
        instructions: [
            "Boil rice in plenty of water until porridge-like.",
            "Season with fish sauce and pepper.",
            "Add boiled eggs cut in half.",
            "Top with fried garlic."
        ]
    },
    {
        id: 64,
        name: "Tuyo, Kamatis at Kanin",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/tuyo-kamatis.jpg",
        servings: 2,
        estimatedCost: 45,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "4 pc Tuyo",
            "2 pc Tomato",
            "2 cup Rice",
            "1 tbsp Oil",
            "2 tbsp Vinegar"
        ],
        instructions: [
            "Fry tuyo in oil until crisp.",
            "Slice tomatoes and season with a little vinegar.",
            "Serve tuyo with tomatoes and hot rice."
        ]
    },
    {
        id: 65,
        name: "Adobong Kangkong with Rice",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy", "nopork"],
        image: "assets/recipes/adobong-kangkong.jpg",
        servings: 3,
        estimatedCost: 50,
        prepTime: "10 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "2 bundle Kangkong",
            "4 cloves Garlic",
            "3 tbsp Soy Sauce",
            "2 tbsp Vinegar",
            "1 tbsp Oil",
            "3 cup Rice"
        ],
        instructions: [
            "Sauté garlic in oil.",
            "Add kangkong stalks first, then leaves.",
            "Pour soy sauce and vinegar; simmer briefly.",
            "Serve with rice."
        ]
    },
    {
        id: 66,
        name: "Ginisang Togue",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/ginisang-togue.jpg",
        servings: 3,
        estimatedCost: 60,
        prepTime: "10 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "400 g Togue",
            "1 pc Carrot",
            "1 pc Onion",
            "3 cloves Garlic",
            "2 tbsp Fish Sauce",
            "1 tbsp Oil",
            "3 cup Rice"
        ],
        instructions: [
            "Sauté garlic and onion in oil.",
            "Add carrot strips and cook briefly.",
            "Add togue and fish sauce; stir-fry 3-5 minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 67,
        name: "Sardinas con Misua",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/sardinas-misua.jpg",
        servings: 3,
        estimatedCost: 60,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "1 can Sardines",
            "1 pack Misua Noodles",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Oil",
            "1 pc Egg"
        ],
        instructions: [
            "Sauté garlic and onion in oil.",
            "Add sardines and water; bring to a boil.",
            "Drop in misua and beaten egg.",
            "Simmer until noodles are soft."
        ]
    },
    {
        id: 68,
        name: "Ginisang Repolyo",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/ginisang-repolyo.jpg",
        servings: 4,
        estimatedCost: 65,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "500 g Cabbage",
            "1 pc Carrot",
            "1 pc Onion",
            "3 cloves Garlic",
            "2 tbsp Soy Sauce",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Sauté garlic and onion in oil.",
            "Add carrot and cabbage.",
            "Season with soy sauce and stir-fry until tender.",
            "Serve with rice."
        ]
    },
    {
        id: 69,
        name: "Hotsilog",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/hotsilog.jpg",
        servings: 2,
        estimatedCost: 70,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "250 g Hotdog",
            "2 pc Egg",
            "2 cup Rice",
            "3 cloves Garlic",
            "2 tbsp Oil"
        ],
        instructions: [
            "Fry hotdogs until lightly blistered.",
            "Fry garlic rice in the same pan.",
            "Fry eggs sunny side up.",
            "Plate rice, hotdog, and egg together."
        ]
    },
    {
        id: 70,
        name: "Tinapa at Kamatis with Rice",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid", "protein"],
        image: "assets/recipes/tinapa-kamatis.jpg",
        servings: 2,
        estimatedCost: 65,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "2 pc Tinapa",
            "2 pc Tomato",
            "1 pc Onion",
            "2 cup Rice",
            "1 tbsp Oil"
        ],
        instructions: [
            "Fry tinapa until crisp on the edges.",
            "Slice tomatoes and onion for ensalada.",
            "Serve tinapa with rice and the tomato-onion side."
        ]
    },
    {
        id: 71,
        name: "Nilagang Kamote at Kape",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/nilagang-kamote.jpg",
        servings: 2,
        estimatedCost: 35,
        prepTime: "5 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "500 g Kamote",
            "2 pc Coffee",
            "1 tbsp Sugar"
        ],
        instructions: [
            "Boil kamote until fork-tender.",
            "Prepare hot coffee.",
            "Serve kamote peeled, with coffee on the side."
        ]
    },
    {
        id: 72,
        name: "Pandesal at Itlog",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid", "protein"],
        image: "assets/recipes/pandesal-itlog.jpg",
        servings: 2,
        estimatedCost: 40,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "6 pc Pandesal",
            "2 pc Egg",
            "1 tbsp Oil",
            "2 pc Coffee"
        ],
        instructions: [
            "Scramble the eggs in a little oil.",
            "Stuff pandesal with the scrambled egg.",
            "Serve with hot coffee."
        ]
    },
    {
        id: 73,
        name: "Pancit Bihon Guisado",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/pancit-bihon.jpg",
        servings: 4,
        estimatedCost: 110,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Medium",
        ingredients: [
            "1 pack Bihon",
            "250 g Chicken",
            "1 pc Carrot",
            "300 g Cabbage",
            "1 pc Onion",
            "4 cloves Garlic",
            "3 tbsp Soy Sauce",
            "2 tbsp Oil"
        ],
        instructions: [
            "Sauté garlic, onion, and chicken until cooked.",
            "Add vegetables and stir-fry briefly.",
            "Add soaked bihon, soy sauce, and a little water.",
            "Toss until noodles absorb the sauce."
        ]
    },
    {
        id: 74,
        name: "Ginisang Sayote with Egg",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/ginisang-sayote.jpg",
        servings: 4,
        estimatedCost: 60,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "500 g Sayote",
            "2 pc Egg",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Sauté garlic and onion in oil.",
            "Add sliced sayote and a splash of water; cover until tender.",
            "Stir in beaten eggs and cook through.",
            "Serve with rice."
        ]
    },
    {
        id: 75,
        name: "Tortang Giniling",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein"],
        image: "assets/recipes/tortang-giniling.jpg",
        servings: 4,
        estimatedCost: 130,
        prepTime: "10 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "250 g Giniling",
            "3 pc Egg",
            "1 pc Onion",
            "1 pc Tomato",
            "2 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Sauté ground pork with onion and tomato until cooked.",
            "Mix into beaten eggs.",
            "Fry as small omelets until golden.",
            "Serve with rice."
        ]
    },
    {
        id: 76,
        name: "Ginataang Kalabasa at Sitaw",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/ginataang-kalabasa.jpg",
        servings: 4,
        estimatedCost: 90,
        prepTime: "10 mins",
        cookTime: "25 mins",
        difficulty: "Medium",
        ingredients: [
            "500 g Kalabasa",
            "250 g Sitaw",
            "2 cup Coconut Milk",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Fish Sauce",
            "4 cup Rice"
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add squash, sitaw, and coconut milk.",
            "Simmer until vegetables are tender.",
            "Season with fish sauce and serve with rice."
        ]
    },
    {
        id: 77,
        name: "Sinabawang Gulay with Malunggay",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/sinabawang-gulay.jpg",
        servings: 4,
        estimatedCost: 70,
        prepTime: "10 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "1 bundle Malunggay",
            "300 g Squash",
            "1 pc Onion",
            "2 pc Tomato",
            "1 tbsp Fish Sauce",
            "4 cup Rice"
        ],
        instructions: [
            "Boil onion and tomato in water.",
            "Add squash and simmer until soft.",
            "Add malunggay leaves and fish sauce.",
            "Serve hot with rice."
        ]
    },
    {
        id: 78,
        name: "Pritong Tilapia with Ensaladang Kamatis",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "protein", "nopork"],
        image: "assets/recipes/pritong-tilapia.jpg",
        servings: 4,
        estimatedCost: 160,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "500 g Tilapia",
            "3 pc Tomato",
            "1 pc Onion",
            "3 tbsp Oil",
            "1 tsp Salt",
            "4 cup Rice"
        ],
        instructions: [
            "Season tilapia with salt and fry until crisp.",
            "Chop tomatoes and onion for the ensalada.",
            "Serve fish with rice and ensalada."
        ]
    },
    {
        id: 79,
        name: "Tokwa't Toge",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/tokwat-toge.jpg",
        servings: 4,
        estimatedCost: 75,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "4 pc Tokwa",
            "300 g Togue",
            "1 pc Onion",
            "3 cloves Garlic",
            "2 tbsp Soy Sauce",
            "2 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Fry tokwa cubes until golden; set aside.",
            "Sauté garlic, onion, and togue.",
            "Add tokwa and soy sauce; toss briefly.",
            "Serve with rice."
        ]
    },
    {
        id: 80,
        name: "Chicken Sopas",
        mealType: ["Dinner", "Breakfast"],
        diet: ["anything", "nopork"],
        image: "assets/recipes/chicken-sopas.jpg",
        servings: 4,
        estimatedCost: 120,
        prepTime: "10 mins",
        cookTime: "30 mins",
        difficulty: "Medium",
        ingredients: [
            "250 g Chicken",
            "1 pack Noodles",
            "1 pc Carrot",
            "300 g Cabbage",
            "1 can Evaporated Milk",
            "1 pc Onion",
            "3 cloves Garlic"
        ],
        instructions: [
            "Sauté garlic, onion, and chicken.",
            "Add water and bring to a boil.",
            "Add macaroni noodles and vegetables; simmer until tender.",
            "Stir in evaporated milk and season to taste."
        ]
    },
    {
        id: 81,
        name: "Adobong Paa ng Manok",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "protein", "nopork"],
        image: "assets/recipes/adobong-paa.jpg",
        servings: 4,
        estimatedCost: 90,
        prepTime: "15 mins",
        cookTime: "45 mins",
        difficulty: "Medium",
        ingredients: [
            "500 g Chicken Feet",
            "1/2 cup Soy Sauce",
            "1/4 cup Vinegar",
            "5 cloves Garlic",
            "1 pc Onion",
            "4 cup Rice"
        ],
        instructions: [
            "Clean chicken feet and trim the nails.",
            "Simmer in soy sauce, vinegar, garlic, and onion.",
            "Cook low and slow until tender and the sauce thickens.",
            "Serve with rice."
        ]
    },
    {
        id: 82,
        name: "Adobong Atay ng Manok",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "protein", "nopork"],
        image: "assets/recipes/adobong-atay.jpg",
        servings: 4,
        estimatedCost: 100,
        prepTime: "10 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "500 g Chicken Liver",
            "1/4 cup Soy Sauce",
            "1/4 cup Vinegar",
            "5 cloves Garlic",
            "1 pc Onion",
            "4 cup Rice"
        ],
        instructions: [
            "Sauté garlic and onion.",
            "Add chicken liver and sear briefly.",
            "Add soy sauce and vinegar; simmer until just cooked through.",
            "Serve with rice."
        ]
    },
    {
        id: 83,
        name: "Sinigang na Baboy (Tipid)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid"],
        image: "assets/recipes/sinigang-tipid.jpg",
        servings: 4,
        estimatedCost: 180,
        prepTime: "10 mins",
        cookTime: "45 mins",
        difficulty: "Easy",
        ingredients: [
            "400 g Pork",
            "1 bunch Kangkong",
            "2 pc Tomato",
            "1 pc Onion",
            "1 pack Sinigang Mix",
            "4 cup Rice"
        ],
        instructions: [
            "Boil pork with onion and tomato until tender.",
            "Add sinigang mix and season.",
            "Add kangkong last — skip the extra gulay to cut cost.",
            "Serve hot with rice."
        ]
    },
    {
        id: 84,
        name: "Tortang Talong",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/tortang-talong.jpg",
        servings: 2,
        estimatedCost: 50,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "2 pc Eggplant",
            "2 pc Egg",
            "2 tbsp Oil",
            "1 tsp Salt",
            "2 cup Rice"
        ],
        instructions: [
            "Grill or broil eggplants, then peel.",
            "Flatten and dip in beaten egg with salt.",
            "Fry until golden on both sides.",
            "Serve with rice."
        ]
    },
    {
        id: 85,
        name: "Ginisang Monggo (Tipid)",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "healthy"],
        image: "assets/recipes/monggo-tipid.jpg",
        servings: 4,
        estimatedCost: 60,
        prepTime: "10 mins",
        cookTime: "40 mins",
        difficulty: "Easy",
        ingredients: [
            "1 cup Monggo",
            "1 bundle Malunggay",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Fish Sauce",
            "4 cup Rice"
        ],
        instructions: [
            "Boil monggo until soft.",
            "Sauté garlic and onion, then add the boiled monggo.",
            "Add malunggay and season with fish sauce — no pork needed.",
            "Serve with rice."
        ]
    },
    {
        id: 86,
        name: "Nilagang Paa ng Manok",
        mealType: ["Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/nilagang-paa.jpg",
        servings: 4,
        estimatedCost: 95,
        prepTime: "10 mins",
        cookTime: "50 mins",
        difficulty: "Easy",
        ingredients: [
            "500 g Chicken Feet",
            "300 g Kamote",
            "1 bunch Pechay",
            "1 pc Onion",
            "1 tbsp Fish Sauce",
            "4 cup Rice"
        ],
        instructions: [
            "Boil chicken feet with onion until tender.",
            "Add kamote and simmer until soft.",
            "Add pechay and season with fish sauce.",
            "Serve hot with rice."
        ]
    },
    {
        id: 87,
        name: "Ginisang Ampalaya with Egg",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/ginisang-ampalaya-with-egg.jpg",
        servings: 4,
        estimatedCost: 75,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "300 g Ampalaya",
            "3 pcs Egg",
            "2 pcs Tomato",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Fish Sauce",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Slice ampalaya thinly and soak in salted water for 10 minutes, then squeeze dry to reduce bitterness.",
            "Saute garlic, onion, and tomato in oil.",
            "Add ampalaya and stir-fry for 3 minutes.",
            "Pour in beaten eggs and season with fish sauce; cook until set.",
            "Serve with rice."
        ]
    },
    {
        id: 88,
        name: "Filipino-style Chop Suey",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "nopork"],
        image: "assets/recipes/filipino-style-chop-suey.jpg",
        servings: 4,
        estimatedCost: 180,
        prepTime: "20 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "150 g Chicken",
            "1 pc Carrot",
            "200 g Repolyo",
            "150 g Sayote",
            "100 g Baguio Beans",
            "1 pc Bell Pepper",
            "1 pc Onion",
            "3 cloves Garlic",
            "2 tbsp Soy Sauce",
            "1 tbsp Cornstarch",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Saute garlic and onion, then brown the chicken strips.",
            "Add the harder vegetables first (carrot, sayote, beans) with a splash of water.",
            "Add repolyo and bell pepper, season with soy sauce.",
            "Thicken with cornstarch slurry and cook 2 more minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 89,
        name: "Ginisang Sitaw at Kalabasa",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/ginisang-sitaw-at-kalabasa.jpg",
        servings: 4,
        estimatedCost: 85,
        prepTime: "10 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "300 g Kalabasa",
            "200 g Sitaw",
            "2 pcs Tomato",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Fish Sauce",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Saute garlic, onion, and tomato in oil.",
            "Add cubed kalabasa with 1/2 cup water; simmer until almost tender.",
            "Add sitaw and cook 3-4 minutes so it stays crunchy.",
            "Season with fish sauce and serve with rice."
        ]
    },
    {
        id: 90,
        name: "Ginisang Pechay",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/ginisang-pechay.jpg",
        servings: 4,
        estimatedCost: 55,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "2 bunch Pechay",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Soy Sauce",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Saute garlic and onion in oil.",
            "Add pechay stalks first, then leaves.",
            "Season with soy sauce and cook 2-3 minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 91,
        name: "Monggo Guisado with Malunggay",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "protein", "nopork"],
        image: "assets/recipes/monggo-guisado-with-malunggay.jpg",
        servings: 4,
        estimatedCost: 80,
        prepTime: "10 mins",
        cookTime: "45 mins",
        difficulty: "Easy",
        ingredients: [
            "250 g Monggo",
            "1 cup Malunggay",
            "2 pcs Tomato",
            "1 pc Onion",
            "3 cloves Garlic",
            "2 tbsp Fish Sauce",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Boil monggo in 5 cups water until soft, about 30 minutes.",
            "Saute garlic, onion, and tomato in a separate pan.",
            "Pour the cooked monggo into the saute and season with fish sauce.",
            "Stir in malunggay leaves and simmer 2 minutes.",
            "Serve with rice."
        ]
    },
    {
        id: 92,
        name: "Corn and Malunggay Soup",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/corn-and-malunggay-soup.jpg",
        servings: 4,
        estimatedCost: 70,
        prepTime: "10 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "3 pcs Sweet Corn",
            "1 cup Malunggay",
            "2 pcs Tinapa",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Fish Sauce",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Shave the corn kernels off the cob.",
            "Saute garlic and onion, then add flaked tinapa.",
            "Add corn and 4 cups water; simmer 10 minutes.",
            "Season with fish sauce, add malunggay, and cook 1 more minute.",
            "Serve with rice."
        ]
    },
    {
        id: 93,
        name: "Ensaladang Talong",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/ensaladang-talong.jpg",
        servings: 4,
        estimatedCost: 60,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "4 pcs Talong",
            "2 pcs Tomato",
            "1 pc Onion",
            "2 tbsp Vinegar",
            "1 tbsp Fish Sauce",
            "4 cup Rice"
        ],
        instructions: [
            "Grill or roast talong over the flame until charred and soft; peel.",
            "Chop the flesh roughly.",
            "Toss with diced tomato, onion, vinegar, and fish sauce.",
            "Serve with rice."
        ]
    },
    {
        id: 94,
        name: "Ginisang Tokwa at Gulay",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "protein", "nopork"],
        image: "assets/recipes/ginisang-tokwa-at-gulay.jpg",
        servings: 4,
        estimatedCost: 90,
        prepTime: "15 mins",
        cookTime: "20 mins",
        difficulty: "Easy",
        ingredients: [
            "4 pcs Tokwa",
            "200 g Togue",
            "1 bunch Pechay",
            "150 g Repolyo",
            "100 g Sitaw",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tsp Ginger",
            "2 tbsp Soy Sauce",
            "2 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Fry cubed tokwa until golden brown; set aside.",
            "Saute garlic, onion, and ginger.",
            "Add sitaw and repolyo with a splash of water; cook 3 minutes.",
            "Add togue, pechay, and tokwa; season with soy sauce.",
            "Serve hot with rice."
        ]
    },
    {
        id: 95,
        name: "Vegetable Sinigang",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/vegetable-sinigang.jpg",
        servings: 4,
        estimatedCost: 85,
        prepTime: "15 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "1 pc Labanos",
            "200 g Gabi",
            "150 g Sitaw",
            "100 g Okra",
            "2 pcs Talong",
            "1 bunch Kangkong",
            "2 pcs Tomato",
            "1 pc Onion",
            "1 pack Sinigang Mix",
            "1 tbsp Fish Sauce",
            "4 cup Rice"
        ],
        instructions: [
            "Boil 6 cups water with onion, tomato, and gabi until gabi softens.",
            "Add labanos, sitaw, okra, and talong; simmer 5 minutes.",
            "Stir in sinigang mix and fish sauce.",
            "Add kangkong last and turn off heat.",
            "Serve hot with rice."
        ]
    },
    {
        id: 96,
        name: "Lumpiang Sariwa",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "nopork"],
        image: "assets/recipes/lumpiang-sariwa.jpg",
        servings: 4,
        estimatedCost: 160,
        prepTime: "30 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "1 pack Lumpia Wrapper",
            "200 g Singkamas",
            "1 pc Carrot",
            "150 g Repolyo",
            "100 g Sitaw",
            "150 g Togue",
            "100 g Lettuce",
            "4 pcs Tokwa",
            "1 pc Onion",
            "4 cloves Garlic",
            "3 tbsp Soy Sauce",
            "3 tbsp Sugar",
            "2 tbsp Cornstarch",
            "2 tbsp Peanut Butter",
            "1 tbsp Oil"
        ],
        instructions: [
            "Saute garlic and onion, then cook singkamas, carrot, sitaw, and repolyo until tender-crisp.",
            "Add togue and fried tokwa cubes; season lightly with soy sauce.",
            "Make the sauce: simmer 1 cup water with soy sauce, sugar, and peanut butter; thicken with cornstarch.",
            "Wrap the filling with a lettuce leaf in each wrapper.",
            "Pour sauce on top and sprinkle with crushed garlic."
        ]
    },
    {
        id: 97,
        name: "Adobong Sitaw",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/adobong-sitaw.jpg",
        servings: 4,
        estimatedCost: 60,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "300 g Sitaw",
            "1 pc Onion",
            "4 cloves Garlic",
            "2 tbsp Soy Sauce",
            "1 tbsp Vinegar",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Saute garlic and onion in oil.",
            "Add sitaw and stir-fry 2 minutes.",
            "Add soy sauce and vinegar; do not stir until it boils.",
            "Simmer 5 minutes until sitaw is tender.",
            "Serve with rice."
        ]
    },
    {
        id: 98,
        name: "Ginisang Patola with Egg",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/ginisang-patola-with-egg.jpg",
        servings: 4,
        estimatedCost: 65,
        prepTime: "10 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "2 pcs Patola",
            "2 pcs Egg",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tbsp Fish Sauce",
            "1 tbsp Oil",
            "4 cup Rice"
        ],
        instructions: [
            "Peel and slice patola.",
            "Saute garlic and onion in oil.",
            "Add patola with 1/2 cup water; simmer 5 minutes.",
            "Stir in beaten eggs and season with fish sauce.",
            "Serve with rice."
        ]
    },
    {
        id: 99,
        name: "Steamed Okra with Bagoong",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "healthy", "tipid", "nopork"],
        image: "assets/recipes/steamed-okra-with-bagoong.jpg",
        servings: 4,
        estimatedCost: 55,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "300 g Okra",
            "2 tbsp Bagoong",
            "2 pcs Tomato",
            "1 pc Onion",
            "4 cup Rice"
        ],
        instructions: [
            "Steam or blanch okra for 3-4 minutes until bright green.",
            "Chop tomato and onion.",
            "Serve okra with bagoong, tomato, and onion on the side.",
            "Eat with rice."
        ]
    },
    {
        id: 100,
        name: "Ginataang Langka",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginataang-langka.jpg",
        servings: 4,
        estimatedCost: 90,
        prepTime: "15 mins",
        cookTime: "30 mins",
        difficulty: "Easy",
        ingredients: [
            "500 g Langka",
            "1 cup Coconut Milk",
            "2 pcs Tinapa",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tsp Ginger",
            "1 tbsp Fish Sauce",
            "1 pc Chili",
            "4 cup Rice"
        ],
        instructions: [
            "Saute garlic, onion, and ginger.",
            "Add sliced unripe langka and flaked tinapa.",
            "Pour in coconut milk and simmer 20 minutes until langka is tender.",
            "Season with fish sauce and chili.",
            "Serve with rice."
        ]
    },
    {
        id: 101,
        name: "Ginataang Puso ng Saging",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginataang-puso-ng-saging.jpg",
        servings: 4,
        estimatedCost: 75,
        prepTime: "15 mins",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "1 pc Puso ng Saging",
            "1 cup Coconut Milk",
            "2 pcs Tinapa",
            "1 pc Onion",
            "3 cloves Garlic",
            "1 tsp Ginger",
            "1 tbsp Vinegar",
            "1 tbsp Fish Sauce",
            "4 cup Rice"
        ],
        instructions: [
            "Remove tough outer layers of the banana heart; slice thinly and soak in salted water, then squeeze dry.",
            "Saute garlic, onion, and ginger, then add flaked tinapa.",
            "Add the banana heart, vinegar, and coconut milk; simmer 15 minutes.",
            "Season with fish sauce and serve with rice."
        ]
    },
    {
        id: 102,
        name: "Tortang Kamatis at Itlog",
        mealType: ["Breakfast", "Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/tortang-kamatis-at-itlog.jpg",
        servings: 4,
        estimatedCost: 35,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: ["2 pcs Egg", "3 pcs Tomato", "1 pc Onion", "2 tbsp Oil", "1 pinch Salt", "4 cup Rice"],
        instructions: ["Beat eggs with a pinch of salt.", "Mix in chopped tomatoes and onion to stretch the portion.", "Fry in a little oil until set on both sides.", "Serve with rice."]
    },
    {
        id: 103,
        name: "Ginisang Tokwa",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginisang-tokwa.jpg",
        servings: 4,
        estimatedCost: 45,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["4 pcs Tokwa", "3 cloves Garlic", "1 pc Onion", "2 tbsp Soy Sauce", "2 tbsp Oil", "4 cup Rice"],
        instructions: ["Cube and fry tokwa until golden.", "Saute garlic and onion, then toss in the tokwa.", "Add soy sauce and a splash of water; simmer 2 minutes.", "Serve with rice."]
    },
    {
        id: 104,
        name: "Scrambled Egg with Misua",
        mealType: ["Breakfast", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/scrambled-egg-with-misua.jpg",
        servings: 4,
        estimatedCost: 35,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["1 pack Misua", "2 pcs Egg", "3 cloves Garlic", "1 pc Onion", "1 tbsp Fish Sauce", "4 cup Rice"],
        instructions: ["Saute garlic and onion; add 5 cups water and bring to a boil.", "Add misua and fish sauce; simmer 2 minutes.", "Stir in beaten eggs slowly to make ribbons.", "Serve hot with rice."]
    },
    {
        id: 105,
        name: "Itlog na Maalat na may Kamatis",
        mealType: ["Breakfast", "Lunch"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/itlog-na-maalat-na-may-kamatis.jpg",
        servings: 4,
        estimatedCost: 45,
        prepTime: "5 mins",
        cookTime: "5 mins",
        difficulty: "Easy",
        ingredients: ["2 pcs Salted Egg", "3 pcs Tomato", "1 pc Onion", "4 cup Rice"],
        instructions: ["Peel and slice salted eggs.", "Toss with chopped tomatoes and onion.", "Serve with hot rice."]
    },
    {
        id: 106,
        name: "Ginisang Toge",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginisang-toge.jpg",
        servings: 4,
        estimatedCost: 35,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: ["300 g Togue", "3 cloves Garlic", "1 pc Onion", "1 tbsp Soy Sauce", "1 tbsp Oil", "4 cup Rice"],
        instructions: ["Heat oil on high and saute garlic and onion.", "Add togue and soy sauce; stir-fry 2 to 3 minutes only.", "Serve with rice."]
    },
    {
        id: 107,
        name: "Sinabawang Sayote",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/sinabawang-sayote.jpg",
        servings: 4,
        estimatedCost: 35,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["2 pcs Sayote", "3 cloves Garlic", "1 pc Onion", "1 tsp Salt", "4 cup Rice"],
        instructions: ["Saute garlic and onion.", "Add sliced sayote and 4 cups water; season with salt.", "Simmer until tender. Serve with rice."]
    },
    {
        id: 108,
        name: "Ginisang Kalabasa",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginisang-kalabasa.jpg",
        servings: 4,
        estimatedCost: 40,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["300 g Kalabasa", "3 cloves Garlic", "1 pc Onion", "1 tbsp Fish Sauce", "1 tbsp Oil", "4 cup Rice"],
        instructions: ["Saute garlic and onion.", "Add diced kalabasa, fish sauce, and a little water.", "Cover and simmer until soft and sweet. Serve with rice."]
    },
    {
        id: 109,
        name: "Ginisang Upo",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginisang-upo.jpg",
        servings: 4,
        estimatedCost: 40,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["500 g Upo", "3 cloves Garlic", "1 pc Onion", "2 pcs Tomato", "1 tbsp Fish Sauce", "4 cup Rice"],
        instructions: ["Saute garlic, onion, and tomato.", "Add sliced upo and fish sauce with a bit of water.", "Simmer until translucent. Serve with rice."]
    },
    {
        id: 110,
        name: "Sardinas na may Pechay",
        mealType: ["Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/sardinas-na-may-pechay.jpg",
        servings: 4,
        estimatedCost: 45,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: ["1 can Sardines", "1 bundle Pechay", "3 cloves Garlic", "1 pc Onion", "4 cup Rice"],
        instructions: ["Saute garlic and onion.", "Add sardines with its sauce and a cup of water.", "Add pechay and cook 2 minutes. Serve with rice."]
    },
    {
        id: 111,
        name: "Ginisang Corned Beef na may Repolyo",
        mealType: ["Breakfast", "Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/ginisang-corned-beef-na-may-repolyo.jpg",
        servings: 4,
        estimatedCost: 55,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["1 can Corned Beef", "300 g Cabbage", "3 cloves Garlic", "1 pc Onion", "4 cup Rice"],
        instructions: ["Saute garlic and onion, then add half the corned beef.", "Bulk up with shredded cabbage and a splash of water.", "Simmer until cabbage is tender. Serve with rice."]
    },
    {
        id: 112,
        name: "Dilis Guisado",
        mealType: ["Breakfast", "Lunch"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/dilis-guisado.jpg",
        servings: 4,
        estimatedCost: 40,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: ["50 g Dilis", "3 pcs Tomato", "1 pc Onion", "3 cloves Garlic", "1 tbsp Oil", "4 cup Rice"],
        instructions: ["Fry dilis until crisp; set aside.", "Saute garlic, onion, and tomato until saucy.", "Toss dilis back in. Serve with rice."]
    },
    {
        id: 113,
        name: "Century Tuna Omelet",
        mealType: ["Breakfast", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/century-tuna-omelet.jpg",
        servings: 4,
        estimatedCost: 50,
        prepTime: "5 mins",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: ["1 can Canned Tuna", "2 pcs Egg", "1 pc Onion", "2 tbsp Oil", "4 cup Rice"],
        instructions: ["Mix half a can of tuna into beaten eggs with chopped onion.", "Fry into a filling patty until golden.", "Serve with rice."]
    },
    {
        id: 114,
        name: "Luncheon Meat Fried Rice",
        mealType: ["Breakfast"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/luncheon-meat-fried-rice.jpg",
        servings: 4,
        estimatedCost: 60,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["1 can Luncheon Meat", "4 cup Rice", "3 cloves Garlic", "2 tbsp Soy Sauce", "2 tbsp Oil"],
        instructions: ["Cube a slice of luncheon meat and fry until browned.", "Add garlic then leftover rice; toss with soy sauce.", "Fry until slightly crisp. Serve hot."]
    },
    {
        id: 115,
        name: "Tortang Sardinas",
        mealType: ["Breakfast", "Lunch", "Dinner"],
        diet: ["anything", "tipid", "nopork"],
        image: "assets/recipes/tortang-sardinas.jpg",
        servings: 4,
        estimatedCost: 45,
        prepTime: "5 mins",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: ["1 can Sardines", "1 pc Egg", "3 tbsp Flour", "1 pc Onion", "2 tbsp Oil", "4 cup Rice"],
        instructions: ["Mash sardines and mix with egg, flour, and chopped onion.", "Form into patties and fry until golden on both sides.", "Serve with rice."]
    }
];
