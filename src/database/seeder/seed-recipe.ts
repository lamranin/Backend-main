import { databaseClient } from "database"
import { authService } from "modules/auth/auth.service"
import { recipeService } from "modules/recipe/recipe.service"
import { logger } from "utils/log/logger.util"



export const seedRecipe = async () =>{
    const existingRecipe = await databaseClient.recipe.findMany({})
    if(existingRecipe.length < recipes.length){
        let adminUser: any;
        
        adminUser= await databaseClient.user.findUnique({
            where:{
                username: "admin"
            }
        })
        if(!adminUser)
        adminUser = await authService.signUp(
            {
            username: "admin",
            email: "admin@fyp.com",
            password: "123456789",
            name:"admin",
            contact: "01234567890",
            dateOfBirth: new Date().toISOString(),
            }
        )
        if(adminUser)
        {for(const recipe of recipes){
            const mappedIngredients = recipe.ingredients.map((ingredient)=> {
                return {
                    name: ingredient.name,
                    quantity: ingredient.quantity.toString(),
                    unit: ingredient.unit
                }
            })
            await databaseClient.category.upsert({
                create:{
                    name: recipe.category
                },
                update:{},
                where: {
                    name: recipe.category
                }
            })

            for(const ingredient of mappedIngredients){
                await databaseClient.ingredient.upsert({
                    create:{
                        name: ingredient.name
                    },
                    update:{},
                    where:{
                        name: ingredient.name
                    }
                })
            }

            const newRecipe = await recipeService.createRecipe(
                recipe.name,
                description,
                [recipe.imageUrl],
                adminUser.id,
                mappedIngredients,
                recipe.category
            );
            logger.info(`Added recipe ${newRecipe?.title}`)
        }}
    }
}

const description = `<h1>Delicious Burger Recipe</h1>
<p>Welcome to the kitchen where you'll create a mouth-watering burger masterpiece. Follow these simple steps to craft a flavorful delight!</p>

<p><strong>Instructions:</strong></p>
<ol>
  <li>Preheat the grill or stovetop pan.</li>
  <li>Divide the ground beef into 4 equal portions and shape them into patties.</li>
  <li>Season the patties with salt and pepper.</li>
  <li>Grill the patties for 4-5 minutes on each side or until cooked to your liking.</li>
  <li>Toast the hamburger buns on the grill or in a toaster.</li>
  <li>Assemble the burgers by placing a patty on the bottom half of each bun.</li>
  <li>Add lettuce, tomato slices, onions, and cheese if desired.</li>
  <li>Spread ketchup, mustard, and mayonnaise on the top half of the bun.</li>
  <li>Place the top bun over the fillings to complete the burger.</li>
  <li>Serve hot and enjoy your delicious homemade burger!</li>
</ol>

<p>Feel free to customize your burger with additional toppings or sauces to suit your taste preferences. Bon appétit!</p>
`


const recipes = [
    {
        "name": "Bread Baking: 70-Percent Hydration Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/372/372186f5e6bec5505204bef2364a80f2.JPG?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=338e77e85fb1ff187e44b7f81d8f0dbf12726b694e9a576e890a04c054312a82",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "bread flour",
                "unit": "ounce",
                "quantity": 20.0
            },
            {
                "name": "water",
                "unit": "ounce",
                "quantity": 14.0
            },
            {
                "name": "yeast",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Garlic Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6e7/6e7e997bc716cef5636b990fcc9315e8.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a1b920f11fae0244a3b7b9d491ea51cf1e4ddd1aba2bfa4fa09f25491130390d",
        "category": "snack",
        "ingredients": [
            {
                "name": "Italian bread",
                "unit": "ounce",
                "quantity": 16.0
            },
            {
                "name": "unsalted butter",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "parsley",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "Parmesan cheese",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Pitta bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/f93/f9318ccc0afeb80a586af9579b415364.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b3eff25f2e172461aa3b498036f82c31e21e400ffe3e7e14fb5431db27ecd4e1",
        "category": "brunch",
        "ingredients": [
            {
                "name": "yeast",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "bread flour",
                "unit": "gram",
                "quantity": 500.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Spanish tomato bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/489/4898d43ae4d8132105bea6b95a9a7b67.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=582efaa1c07a5dc21a6f6067e7fbc196aa109c32a2ada4d0b7f03f6567cbc2e9",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "sourdough bread",
                "unit": "loaf",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 3.5
            },
            {
                "name": "tomatoes",
                "unit": "pcs",
                "quantity": 2.5
            },
            {
                "name": "extra virgin olive oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Grilled Bread recipes",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6dd/6dde1b504825e65aa1c3d4852f1f02ab?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5503ea7bb9f4215d06f1ce5a072edb1a4b57486518e0264efa2c031036c7a7ca",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "bread",
                "unit": "loaf",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 1.0
            },
            {
                "name": "olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "coarse salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/500/5007fb0b77c9eb6e51f6ed6242c92d97.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9a4369bd19ef2ee3c71059cb8bf0501a7439e20e2bebd8b8b6dfe7bedb996fa5",
        "category": "brunch",
        "ingredients": [
            {
                "name": "bread flour",
                "unit": "cup",
                "quantity": 8.0
            },
            {
                "name": "Yeast",
                "unit": "package",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "teaspoon",
                "quantity": 4.0
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Breakfast Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/394/394abe60d3842dfd6978e612cb72fe2c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=863358abdd5334749f940fcb3c675284aeee3f41350d10f042b931345cf948f7",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "bread flour",
                "unit": "cup",
                "quantity": 2.75
            },
            {
                "name": "whole wheat flour",
                "unit": "cup",
                "quantity": 2.75
            },
            {
                "name": "baking soda",
                "unit": "teaspoon",
                "quantity": 1.75
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "buttermilk",
                "unit": "cup",
                "quantity": 2.75
            },
            {
                "name": "egg",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "oatmeal",
                "unit": "teaspoon",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Saint George's Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/d82/d824c4b80f6d6d3b7e774da049bf3deb.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ed339624fa2f318a519b4cf1576c7918323e16e925085aa6c45760544fd141ce",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "bread flour",
                "unit": "gram",
                "quantity": 300.0
            },
            {
                "name": "yeast",
                "unit": "gram",
                "quantity": 8.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "cheese",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "water",
                "unit": "gram",
                "quantity": 175.0
            },
            {
                "name": "bread flour",
                "unit": "gram",
                "quantity": 250.0
            },
            {
                "name": "water",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "yeast",
                "unit": "gram",
                "quantity": 8.0
            },
            {
                "name": "bread flour",
                "unit": "gram",
                "quantity": 250.0
            },
            {
                "name": "water",
                "unit": "gram",
                "quantity": 150.0
            },
            {
                "name": "yeast",
                "unit": "gram",
                "quantity": 8.0
            },
            {
                "name": "granulated sugar",
                "unit": "gram",
                "quantity": 10.0
            },
            {
                "name": "nuts",
                "unit": "gram",
                "quantity": 80.0
            }
        ]
    },
    {
        "name": "Bread with Peanut Butter",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/60b/60b447191785cc0f759a5c4ba07ba473.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f6b87e33e73ef9d7668dc40f56670dc558736d62e346cac5f36616a161f77cb6",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "whole-wheat bread",
                "unit": "slice",
                "quantity": 1.0
            },
            {
                "name": "peanut butter",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Unleavened Griddle Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/f3d/f3d288ed099b873f67419d86e04662c0.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=13d644b83da7f90cf84cf7ae9d82076c2e1f4ce63dc64c38c884cbd49c3f4483",
        "category": "brunch",
        "ingredients": [
            {
                "name": "whole wheat flour",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "bread flour",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 1.125
            }
        ]
    },
    {
        "name": "No Knead Bread Recipe",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/7b6/7b66095b01297334fdcd60425de5c4dc.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=659df20865f9245b677c690836d2b11ee21d35478f681daf2529f8fd86bc2b5e",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "bread flour",
                "unit": "cup",
                "quantity": 3.0
            },
            {
                "name": "yeast",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "kosher salt",
                "unit": "tablespoon",
                "quantity": 0.75
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 1.5
            }
        ]
    },
    {
        "name": "Garlic Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b14/b140daf0b4d0b3f111750c46f1f07501.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=25c165809bf36a0adfbd9041949ab55e889ea6d13f9c52fe166be17d497f00cc",
        "category": "snack",
        "ingredients": [
            {
                "name": "italian bread",
                "unit": "loaf",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Banana Bread Biscotti",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/34a/34a015d1803c5f0cce0dedaa6703eca5.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=49e408e67d11bbb85b48456f6b23bd222bb4beb045ef0bf795d77c1e3e5a7f18",
        "category": "snack",
        "ingredients": [
            {
                "name": "banana bread",
                "unit": "loaf",
                "quantity": 1.0
            },
            {
                "name": "honey",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Garlic Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e58/e585b696f72c617461bf0cdf2058a38f.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=6c669ef96859ce028a00fe0d1a92250aeb826b692e841b224541fc56eb12421d",
        "category": "snack",
        "ingredients": [
            {
                "name": "bread",
                "unit": "loaf",
                "quantity": 1.0
            },
            {
                "name": "butter",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 5.0
            },
            {
                "name": "paprika",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "chives",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Bread Machine Rye Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b39/b39cdd50563daaa0889525c9acb3ba5a.JPG?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ca8d2ff7d819507e5be908653f3c31f442605f4613c1868393a2d5c5ef61589a",
        "category": "brunch",
        "ingredients": [
            {
                "name": "yeast",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "bread flour",
                "unit": "ounce",
                "quantity": 4.5
            },
            {
                "name": "whole wheat flour",
                "unit": "ounce",
                "quantity": 4.5
            },
            {
                "name": "rye flour",
                "unit": "ounce",
                "quantity": 4.5
            },
            {
                "name": "wheat gluten",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "sugar",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "caraway seeds",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 1.5
            }
        ]
    },
    {
        "name": "Crusty Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e24/e2456ee956896a8dbc8f734ae6041b31.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=edb82f1588c3422241f580e1bdb10c99ba401f75ee83f511eeba39d58ebbd559",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "water",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "sugar",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "yeast",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "bread flour",
                "unit": "cup",
                "quantity": 5.5
            }
        ]
    },
    {
        "name": "Ladopsomo Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/081/0818313e72c84b6c3f37fddd18afae8c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d635d90998a82fe2c5a893de4420ba736f5e53dde2fc77d1955213aace239cb9",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "yeast",
                "unit": "envelope",
                "quantity": 2.0
            },
            {
                "name": "sugar",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "bread flour",
                "unit": "cup",
                "quantity": 4.25
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "extra-virgin olive oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "vegetable oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "\u201cBloomer\u201d Bread",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e17/e1738c32f6e51b9ac2b6474dae1f9712.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=91a894a8e1a731df97c21031b97fc2412ac6a8af4fb4596766d4f08529bdeb8a",
        "category": "brunch",
        "ingredients": [
            {
                "name": "bread flour",
                "unit": "gram",
                "quantity": 500.0
            },
            {
                "name": "extra virgin olive oil",
                "unit": "milliliter",
                "quantity": 50.0
            },
            {
                "name": "sugar",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "gram",
                "quantity": 10.0
            },
            {
                "name": "yeast",
                "unit": "gram",
                "quantity": 9.0
            },
            {
                "name": "water",
                "unit": "milliliter",
                "quantity": 300.0
            }
        ]
    },
    {
        "name": "Bread and Milk",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/fec/fec3152ec0d99c0a9e79833a954fa2ba.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=570e0bba1b18d4e338118bcd8867f1965f8de45a35c65c61b0a3965dacb33231",
        "category": "brunch",
        "ingredients": [
            {
                "name": "white bread",
                "unit": "slice",
                "quantity": 2.0
            },
            {
                "name": "vanilla sugar",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "milk",
                "unit": "cup",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Chocolate and Walnut Bread Panini",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6b2/6b2f1b485ad90b3f24ca36154f53cfee.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190922Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9c65f0f724685c234a6c23044127c9ec6e33c2bdb36d7d97d379b974c8f29459",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "walnut bread",
                "unit": "loaf",
                "quantity": 1.0
            },
            {
                "name": "bitter chocolate",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "butter",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Roast sirloin of beef",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/207/2074a28ff50eba58d79304c9296438a1.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=632b8d854a773115d04de8591886316e262aea03a48662abc9c6fa507aa2da45",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "beef",
                "unit": "kilogram",
                "quantity": 1.25
            },
            {
                "name": "red wine",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "beef consomm\u00e9",
                "unit": "gram",
                "quantity": 400.0
            }
        ]
    },
    {
        "name": "Beef Tea",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ad3/ad35ae4c847dcd39bad104838007f84a.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d662845c470214d091b16d4bf066f8064067a75976cca7173ccc07391f469871",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "chuck steak",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Beef Brisket",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/deb/debce0693c8d8a6988af80e1f94e4c4c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ecfb3f0b00d7c91cba1e49d1f9c81890cd7dc922f6d9008890db8292fef90e79",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef",
                "unit": "pound",
                "quantity": 3.5
            },
            {
                "name": "barbeque sauce",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "soy sauce",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Portabello Beef Stew",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/72f/72fd32d089fdc211a0b35a7e41ed47e2.JPG?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=324c9e44710d8d8ae954ab0ec32213c899c160a0221acfd6894b6a9c04d50b0d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef stew meat",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "flour",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "dried thyme",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "red wine",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "beef broth",
                "unit": "can",
                "quantity": 1.0
            },
            {
                "name": "carrots",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "portabello mushrooms",
                "unit": "ounce",
                "quantity": 10.0
            }
        ]
    },
    {
        "name": "Beef Goulash",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/229/2292adfebf71a994fc515cd5895012fe.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=280ebdc98c57057a4c51b568b7f40e14fb9534f224524208e43f9c7a0fdc130c",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "unsalted butter",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "olive oil",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "beef chuck",
                "unit": "pound",
                "quantity": 5.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "yellow onions",
                "unit": "pound",
                "quantity": 5.0
            },
            {
                "name": "paprika",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "beef stock",
                "unit": "cup",
                "quantity": 3.0
            },
            {
                "name": "Sour cream",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "egg noodles",
                "unit": "pound",
                "quantity": 2.0
            },
            {
                "name": "chives",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Beef stew",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/501/501a9b12d18f5cbcaad0d00263ec2f7b.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e7bd9ff7242f8b8fbe1596c759a8c89d74673c703b74d21be06eab45eb32f8d7",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "stewing beef",
                "unit": "gram",
                "quantity": 800.0
            },
            {
                "name": "flour",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "shallots",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "celery",
                "unit": "stick",
                "quantity": 2.0
            },
            {
                "name": "carrots",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "thyme",
                "unit": "gram",
                "quantity": 15.0
            },
            {
                "name": "vine tomatoes",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "red wine",
                "unit": "milliliter",
                "quantity": 150.0
            },
            {
                "name": "beef stock",
                "unit": "milliliter",
                "quantity": 500.0
            },
            {
                "name": "bay leaves",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Worcestershire sauce",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Beef Jerky",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/346/3464d06a3fa4f31b0d898b714dbfd5c4.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=850b4faf38dde0fe40c0cafeaf782c6b95ed245a52b155464ad6a4b8694f61fd",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "seasoning",
                "unit": "cup",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Beef Carnitas",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/431/431ea8ed1e8b779dc8644e0c3a8d5c19.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9eb6a2e8c7c369af78e775cdbe17f98ef9c815c53c7ce3fc0785e2342672b614",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lean beef stew meat",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "salsa",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "chipotle chili",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "black pepper",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "beef stock",
                "unit": "cup",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Best Beef Brisket",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/20b/20bbd08a14d9ebc74ec0f09a692174ca.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=4f94587860ac573a69d8c69dd251bac2875c6f0f2f3ee42733312472bf441c3f",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef brisket",
                "unit": "pound",
                "quantity": 4.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "baby potatoes",
                "unit": "pound",
                "quantity": 3.0
            },
            {
                "name": "Extra-virgin olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "low-sodium beef broth",
                "unit": "cup",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Roast sirloin of beef",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/889/88989a61c8c566b8d29ed6b982fb06d8.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=51ac1eaa01e5a77ac27f503fe4ce49dd1877d6c40fda1de5e2b7d1e0926cf346",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "beef",
                "unit": "kilogram",
                "quantity": 1.25
            },
            {
                "name": "red wine",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "beef consomm\u00e9",
                "unit": "gram",
                "quantity": 400.0
            }
        ]
    },
    {
        "name": "Beef and Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/3a3/3a3e9762e8c569303bf4dcfa01200b62.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=79beb9e5f469ffa78fac2ab26ce08015924971292e008243744b8eb0bfe970be",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef bones",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "carrots",
                "unit": "pound",
                "quantity": 0.3333333333333333
            },
            {
                "name": "celery",
                "unit": "pound",
                "quantity": 0.3333333333333333
            },
            {
                "name": "yellow onion",
                "unit": "pound",
                "quantity": 0.3333333333333333
            },
            {
                "name": "beef bouillon cubes",
                "unit": "ounce",
                "quantity": 1.0
            },
            {
                "name": "granulated garlic",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "top round",
                "unit": "pound",
                "quantity": 2.0
            },
            {
                "name": "beef stock",
                "unit": "cup",
                "quantity": 8.0
            },
            {
                "name": "all-purpose flour",
                "unit": "cup",
                "quantity": 3.5
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "eggs",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "egg yolks",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "oil",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Beef Stew",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6c6/6c6d3abce2503d7dd6aad542d02cd88d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=635ff8fe5b782d4c7ddaa0de4dc4cbddc356d63ed4f3ea8e06cab2f55b6ac2d4",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "flour",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "pepper",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "beef",
                "unit": "pound",
                "quantity": 2.0
            },
            {
                "name": "olive oil",
                "unit": "teaspoon",
                "quantity": 3.0
            },
            {
                "name": "bay leaf",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 1.0
            },
            {
                "name": "beef stock cube",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "onions",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "carrots",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "potatoes",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "frozen peas",
                "unit": "package",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Texas Beef Ribs",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/849/8492f3dfb2bc7ce04f261edb9595c753.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=041bc6f210a46d2d2ef5bafab7f5c3a9ba7ccadd5399360d8a56cd8de0edbf84",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef ribs",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Kosher salt",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "black pepper",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "garlic powder",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "onion powder",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "seasoning",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "beef broth",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Garlic beef",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/5cb/5cbe927d0ebc17c73cf3ab336d9fc0f3.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1857d368c90e649e0b29db29708e5a4b7696d1a33e839122d483e7b35b372817",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "black peppercorn",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 6.0
            },
            {
                "name": "red wine vinegar",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "beef",
                "unit": "gram",
                "quantity": 600.0
            }
        ]
    },
    {
        "name": "Beef Carbonnade",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/c52/c52ce15cae9742945c487f5846188c77.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ef8225ad30ec556212d887d7b84a72b7e2cbcab6292312222b916d7b996d4f66",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "beef chuck",
                "unit": "pound",
                "quantity": 4.0
            },
            {
                "name": "all-purpose flour",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "can beef broth",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 1.0
            },
            {
                "name": "beer",
                "unit": "bottle",
                "quantity": 1.0
            },
            {
                "name": "dried thyme",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "egg noodles",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "parsley",
                "unit": "cup",
                "quantity": 0.5
            }
        ]
    },
    {
        "name": "Italian Beef",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/c2d/c2d462aff629bd332b9f3d0cc839b2ea.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5886b6eae6194f23e2cd26181f3f4a06e3c3bf277573c5f1d15cbfcb5a881a5a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "dried basil",
                "unit": "ounce",
                "quantity": 4.0
            },
            {
                "name": "dried oregano",
                "unit": "ounce",
                "quantity": 2.0
            },
            {
                "name": "black pepper",
                "unit": "ounce",
                "quantity": 1.0
            },
            {
                "name": "garlic powder",
                "unit": "ounce",
                "quantity": 1.0
            },
            {
                "name": "onion powder",
                "unit": "ounce",
                "quantity": 1.0
            },
            {
                "name": "kosher salt",
                "unit": "ounce",
                "quantity": 0.5
            },
            {
                "name": "beef stock",
                "unit": "quart",
                "quantity": 1.0
            },
            {
                "name": "eye-of-round beef roast",
                "unit": "pound",
                "quantity": 6.5
            },
            {
                "name": "beef base",
                "unit": "ounce",
                "quantity": 5.0
            },
            {
                "name": "black pepper",
                "unit": "ounce",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 8.0
            },
            {
                "name": "celery",
                "unit": "stalk",
                "quantity": 3.0
            },
            {
                "name": "bay leaves",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Hoagie rolls",
                "unit": "serving",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Beef Gulasch",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/566/5663b3ba39406617439bde11b14eb74f.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=78cf1774b86fbce0657a07f0bf967abfc05d137fd5f5321b04994453bb216437",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "canola oil",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "white onions",
                "unit": "cup",
                "quantity": 8.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "dried marjoram",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "tomato paste",
                "unit": "tablespoon",
                "quantity": 1.5
            },
            {
                "name": "sweet paprika",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "paprika",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "white wine vinegar",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "low-salt chicken broth",
                "unit": "cup",
                "quantity": 6.0
            },
            {
                "name": "bay leaves",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "lemon peel",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "boneless beef short ribs",
                "unit": "pound",
                "quantity": 3.5
            }
        ]
    },
    {
        "name": "Beef Brisket",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/899/89920f583ea55f5ac66b69fe22cab9a1.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2ebd23149b302e50ed7b79c13dbfec0fb04500b830bd03bb274a1416fb254391",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef brisket",
                "unit": "pound",
                "quantity": 7.0
            },
            {
                "name": "seasoning",
                "unit": "cup",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Easy roast beef",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/951/951a42caf41583c068caae59f8414112.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d4efafe5e074559b052b4ca8d7a2c7f9b3234a8089eddc098b115753f54b0c48",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "flour",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "mustard powder",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "top rump",
                "unit": "gram",
                "quantity": 950.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "carrots",
                "unit": "gram",
                "quantity": 500.0
            },
            {
                "name": "flour",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "beef stock",
                "unit": "milliliter",
                "quantity": 250.0
            }
        ]
    },
    {
        "name": "Beef Stew",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/800/800ae62ecd4cf5f3c28a2c3706e94370.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190924Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d7247b251e2c06ef9357d00708f20c064066bf321c00c1ef2f536cb6f3d41168",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "onions",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "carrots",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "celery",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 6.0
            },
            {
                "name": "cornstarch",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "beefsteak tomatoes",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "turmeric",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "red pepper flakes",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "beef",
                "unit": "pound",
                "quantity": 1.5
            },
            {
                "name": "beef stock",
                "unit": "ounce",
                "quantity": 24.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Lancashire Mutton Hotpot",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/aea/aea282df5eeded39231cd14d92d421de.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=629456dd7803c4b5295aa5c2049cbb7964b9b86807092f69c7b8b7486c10139f",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "butter",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "lamb chump",
                "unit": "chop",
                "quantity": 10.0
            },
            {
                "name": "red cabbage",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "potatoes",
                "unit": "gram",
                "quantity": 800.0
            },
            {
                "name": "lamb kidneys",
                "unit": "pcs",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Mutton Do Pyaaza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/565/565ece976264f311468aa8553bb3e5e2.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b875a74af0c98c52b4486c47e9d432a03fd961e55fd0e4ef5ed43cd2e6e1967a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Mutton",
                "unit": "pound",
                "quantity": 2.0
            },
            {
                "name": "Red onions",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "Garlic",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "Ginger",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Red chillies",
                "unit": "pcs",
                "quantity": 4.5
            },
            {
                "name": "Cloves",
                "unit": "pcs",
                "quantity": 9.0
            },
            {
                "name": "cardamom",
                "unit": "pcs",
                "quantity": 2.5
            },
            {
                "name": "Cinnamon",
                "unit": "stick",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Turmeric",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "Cumin",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Mustard oil",
                "unit": "tablespoon",
                "quantity": 2.5
            }
        ]
    },
    {
        "name": "Garlic Mutton",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/8f8/8f82a04eac9bc93bccd4cef63b7c7cdc.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e373c46de6e7ff3068ef10cbba71d3919177fc8078db88a76ca5b5a4f623bb8b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "mutton",
                "unit": "gram",
                "quantity": 500.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 20.0
            },
            {
                "name": "yoghurt",
                "unit": "tablespoon",
                "quantity": 6.0
            },
            {
                "name": "garlic",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "clarified butter",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "mustard oil",
                "unit": "tablespoon",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Mutton Stew",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/39c/39c888187bfc1c333c08cde874303d42.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ca886e6a4d1aa72e87d74395335c401735c202c1e2cb3e1c6ae9859050cc9b9b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "grapeseed oil",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "white onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 4.0
            },
            {
                "name": "carrots",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "celery",
                "unit": "head",
                "quantity": 1.0
            },
            {
                "name": "fresh rosemary",
                "unit": "sprig",
                "quantity": 6.0
            },
            {
                "name": "mutton",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "red wine",
                "unit": "bottle",
                "quantity": 1.0
            },
            {
                "name": "tomato paste",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "vegetable stock",
                "unit": "cup",
                "quantity": 4.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "potatoes",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "butter",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Rachel Allen's Irish Stew",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b0c/b0c598fd82fb3bdc241d4a3e9cb3765d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=6c87b00b7760001b93ac3e4c1b8e5e6986cd55846e1e60453156b6581eed6bc7",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lamb chops",
                "unit": "pound",
                "quantity": 3.3333333333333335
            },
            {
                "name": "extra virgin olive oil",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "baby carrots",
                "unit": "carrot",
                "quantity": 3.0
            },
            {
                "name": "baby onions",
                "unit": "pcs",
                "quantity": 12.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "lamb stock",
                "unit": "milliliter",
                "quantity": 400.0
            },
            {
                "name": "potatoes",
                "unit": "pcs",
                "quantity": 10.0
            },
            {
                "name": "thyme",
                "unit": "sprig",
                "quantity": 1.0
            },
            {
                "name": "parsley",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "chives",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Ambur Star Mutton Biriyani",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/3f7/3f7051621703d609b6418df1d1b1c2fa.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=c355d35aa0a513ae435ec3da24e45312753f48113fcdee75f9b25333e8f86cba",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "ginger",
                "unit": "inch",
                "quantity": 3.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 20.0
            },
            {
                "name": "green chilies",
                "unit": "pcs",
                "quantity": 10.0
            },
            {
                "name": "cinnamon stick",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "star anise",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "cardamom pods",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "cloves",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "mace",
                "unit": "pcs",
                "quantity": 5.0
            },
            {
                "name": "basmati rice",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "red chilies",
                "unit": "chili",
                "quantity": 10.0
            },
            {
                "name": "ghee",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "peanut oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "shallots",
                "unit": "gram",
                "quantity": 250.0
            },
            {
                "name": "tomatoes",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 2.75
            },
            {
                "name": "mint",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "coriander",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 2.25
            },
            {
                "name": "yogurt",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "lime",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "goat meat",
                "unit": "pound",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Scotch broth",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/854/8548ce0a4586aa88f5c94f05d456de81.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=642a8c01526391cfd598dd046277cc341a98795dbce74f53d3078cfc623703ef",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "carrots",
                "unit": "gram",
                "quantity": 250.0
            },
            {
                "name": "turnips",
                "unit": "gram",
                "quantity": 250.0
            },
            {
                "name": "onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "celery",
                "unit": "stalk",
                "quantity": 1.0
            },
            {
                "name": "leek",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "barley",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "peas",
                "unit": "gram",
                "quantity": 125.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "stock",
                "unit": "liter",
                "quantity": 2.299999952316284
            },
            {
                "name": "kale",
                "unit": "gram",
                "quantity": 85.0
            }
        ]
    },
    {
        "name": "Irish Stew",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/5da/5da3406a5eb1a4c3589c02caee3c5189.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=fdf8ee3f15e208c6ddbf29318d50bea5e78a39a531f03e406b005b112872953c",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "mutton",
                "unit": "pound",
                "quantity": 3.0
            },
            {
                "name": "russet potatoes",
                "unit": "pound",
                "quantity": 2.0
            },
            {
                "name": "parsley",
                "unit": "bunch",
                "quantity": 0.5
            },
            {
                "name": "onions",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Nordic Cuisine for the home cook - Buttermilk marinade",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6de/6dee10224e5c4fca3b074093f1e09404.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ef05c515976e8e594a81fe22343911af4028501f0a3da365901d85a455e47013",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "buttermilk",
                "unit": "milliliter",
                "quantity": 500.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "honey",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "herbs",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "mustard",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "lean meat",
                "unit": "kilogram",
                "quantity": 0.75
            }
        ]
    },
    {
        "name": "Lamb Burgers With Tzatziki And Arugula",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/9e9/9e9bfb98a277a97349652a6f4edd8a33.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=420724e3d0ab868e7fe3ca54f14fd181e7133fa7b2bd9deb398b59fd6adc1c6b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "milk yogurt",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "cucumber",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "garlic scapes",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "mint",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "lime",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "ground lamb",
                "unit": "pound",
                "quantity": 2.0
            },
            {
                "name": "English muffins",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "arugula",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Lamb stew with black pepper, coconut and clove",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/9cb/9cb482fafbb5a2b884ad6a59c2dee184.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ee277f1151174a32de5056d859e3722cb09a55c075ba64fcef8b9d5088294f29",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lamb shoulder",
                "unit": "kilogram",
                "quantity": 1.0
            },
            {
                "name": "cinnamon stick",
                "unit": "piece",
                "quantity": 4.0
            },
            {
                "name": "cloves",
                "unit": "pcs",
                "quantity": 10.0
            },
            {
                "name": "black peppercorns",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "rapeseed oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "red onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "flour",
                "unit": "tablespoon",
                "quantity": 1.5
            },
            {
                "name": "coconut milk",
                "unit": "milliliter",
                "quantity": 400.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "potatoes",
                "unit": "pcs",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Garlic roast lamb with hotpot potatoes",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/275/275703b9709e60e01a8e48543af2bf4d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=6ae53e986d47d4e359e7cdd7d64ca1c1e61113d6d08c3078beebe01627d23f65",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "leg of lamb",
                "unit": "kilogram",
                "quantity": 1.7999999523162842
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 5.0
            },
            {
                "name": "rosemary sprigs",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "thyme sprigs",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "butter",
                "unit": "gram",
                "quantity": 50.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "lamb shoulder",
                "unit": "gram",
                "quantity": 400.0
            },
            {
                "name": "potato",
                "unit": "kilogram",
                "quantity": 2.0
            },
            {
                "name": "carrot",
                "unit": "gram",
                "quantity": 300.0
            },
            {
                "name": "flour",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "lamb or beef stock",
                "unit": "milliliter",
                "quantity": 700.0
            },
            {
                "name": "lamb or beef stock",
                "unit": "milliliter",
                "quantity": 450.0
            },
            {
                "name": "Worcestershire sauce",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "spinach",
                "unit": "bean",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Fried Mutton Loin With Shaved Cauliflower, Preserved Lemon, and Smoked Paprika",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/d23/d23af3909216d3b53e9259635f5ad202.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d3b327310c037af8a708a121258a562cfc18fc583f6a4f48f0df9dada31e3103",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cauliflower",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "extra-virgin olive oil",
                "unit": "tablespoon",
                "quantity": 6.0
            },
            {
                "name": "Lemon",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "cumin seeds",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "mint",
                "unit": "sprig",
                "quantity": 2.0
            },
            {
                "name": "pumpkin seeds",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "sunflower seeds",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "mutton",
                "unit": "ounce",
                "quantity": 9.0
            },
            {
                "name": "Garlic",
                "unit": "clove",
                "quantity": 1.0
            },
            {
                "name": "lemon",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "honey",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "smoked paprika",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "fennel",
                "unit": "sprig",
                "quantity": 6.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Mutton Do Pyaza and A New Beginning recipes",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ac6/ac67cca2c1661e587bf6684c405201c4?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d91eb79009068bdf99f7462d891b95369c3987c6428d10a7478b72c275ee24dd",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "mustard oil",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "cardamom",
                "unit": "pcs",
                "quantity": 2.5
            },
            {
                "name": "cinnamon stick",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "red chili",
                "unit": "pcs",
                "quantity": 3.5
            },
            {
                "name": "cloves",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "cumin seeds",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "coriander seeds",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "bay leaf",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "turmeric",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 5.5
            },
            {
                "name": "red onion",
                "unit": "pound",
                "quantity": 1.25
            },
            {
                "name": "lamb chops",
                "unit": "pound",
                "quantity": 1.5
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "cilantro",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "ginger",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Kentucky-Style Mutton Dip",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ea6/ea66e2c86cc158808164920cba63e61b.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=56905a61fde39319babee8432fece60ac796742ba675bb007fafb2af2b1b24b6",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Worcestershire sauce",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "apple cider vinegar",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "light brown sugar",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "ground allspice",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "garlic powder",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "onion powder",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Khurdi - White Stock Soup",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/81b/81b41de11f3f9035119737331e3f241e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=347f590d26d1619b2693dba60766bca491336a0f93cee5e45258e03e7acb1b2c",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "mutton",
                "unit": "gram",
                "quantity": 325.0
            },
            {
                "name": "garlic",
                "unit": "tablespoon",
                "quantity": 5.5
            },
            {
                "name": "green chilies",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 3.0
            },
            {
                "name": "whole wheat flour",
                "unit": "tablespoon",
                "quantity": 2.5
            },
            {
                "name": "milk",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "cumin seeds",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "cinnamon stick",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "cloves",
                "unit": "pcs",
                "quantity": 4.5
            },
            {
                "name": "black peppercorns",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "mint",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Gosht Aloo Saalon",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/cd7/cd712289cf127edff45e9f8eb811c1bc.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=88c2c18b1bc9f4f483273bbeb22d4e81ed2ffd889b91464dafa39bfc759a92f2",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Mutton",
                "unit": "gram",
                "quantity": 1000.0
            },
            {
                "name": "White potatoes",
                "unit": "gram",
                "quantity": 200.0
            },
            {
                "name": "Onion",
                "unit": "gram",
                "quantity": 300.0
            },
            {
                "name": "Garlic",
                "unit": "gram",
                "quantity": 30.0
            },
            {
                "name": "Fresh Coriander",
                "unit": "pcs",
                "quantity": 30.0
            },
            {
                "name": "Green Chillies",
                "unit": "gram",
                "quantity": 15.0
            },
            {
                "name": "Coriander",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Chilli Powder",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Mustard powder",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Turmeric",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "Cardamoms",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "Cardamom",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "Cloves",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "Black Peppercorns",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Cinammon",
                "unit": "gram",
                "quantity": 5.0
            },
            {
                "name": "Bay leaves",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Fenugreek",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "water",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Rogan josh",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/fa4/fa4338b18f07460fdff60527f64d7f3d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=6a3887d3d42ea95bb1905b73c383f95d47351cc6779999579449293ba4fc33cd",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 5.0
            },
            {
                "name": "black peppercorns",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "cardamom pods",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "cardamom pods",
                "unit": "pcs",
                "quantity": 5.0
            },
            {
                "name": "cloves",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "cinnamon stick",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "mace",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "leg of lamb",
                "unit": "gram",
                "quantity": 750.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 6.0
            },
            {
                "name": "piece ginger",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "coriander",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "cumin",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "chilli powder",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "fennel seeds",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "tomatoes",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "plain yoghurt",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "fresh coriander",
                "unit": "handful",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Tagine of lamb & merguez sausages",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e88/e8857a71c9c5100d83f0209bbf457eb3.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=38ca6e78af5ac70cef9dccbea9a367bef8de157162828e0a7571ea00b03707f7",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cumin",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "paprika",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "turmeric",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "chilli powder",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 3.0
            },
            {
                "name": "piece ginger",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "olive oil",
                "unit": "milliliter",
                "quantity": 200.0
            },
            {
                "name": "lemon juice",
                "unit": "lemon",
                "quantity": 4.0
            },
            {
                "name": "honey",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "parsley",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "coriander",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "lamb shanks",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "carrot",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "prune",
                "unit": "pcs",
                "quantity": 12.0
            },
            {
                "name": "honey",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "lemon",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "merguez sausage",
                "unit": "pcs",
                "quantity": 8.0
            },
            {
                "name": "lemon",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "mint",
                "unit": "sprig",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Tapas Thursday : Masala Chicken w/Veg Fritter Bites",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/219/2192b6a49d314efe62c24a26dd7e16d7.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190926Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=abd9bb029ab977c15bea832db34bde42c80abc29c87d458b4ff727ff8f17003a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "chicken",
                "unit": "pound",
                "quantity": 0.5
            },
            {
                "name": "green peas",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "green chili",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "cumin seeds",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "coriander",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 0.3333333333333333
            },
            {
                "name": "cumin",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "bay leaf",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "cloves",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "cardamom",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "plum tomato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "fresh ginger",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "olive oil",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "red pepper",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "red onion",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "spinach",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "gram flour",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "chili powder",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "mango",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Chapati (Indian Flatbread)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/220/220ad9c36a2e5cdd70d3f26a1ad17332.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3599&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9aa48011c398615771eae792ca2f341e2fc983abd39c7558cf65e195ed40c297",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "wheat flour",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "kosher salt",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "clarified butter",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Indian Rice Mess",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a33/a332121eaa60a84c93174a5ee54e06b2.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0cf1da4c4d544898f43c562dd97ad5196b7574468bbbbc01633ef86858b9297a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Rice",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "Brussel Sprouts",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "Frozen Peas",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "Masala",
                "unit": "ounce",
                "quantity": 16.0
            },
            {
                "name": "Meat",
                "unit": "ounce",
                "quantity": 16.0
            },
            {
                "name": "Red Onion",
                "unit": "pcs",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Tomato Uthappam - Indian Style Omelette",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/f4d/f4dad71fec563dfba890813f81b33e10.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=036eeddd4f5efcdc13ea6ed24efaeb49e1a095d1db1047562898f3a6ca5b68f8",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "idli",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "tomato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "curry leaves",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "sesame oil",
                "unit": "tablespoon",
                "quantity": 2.5
            }
        ]
    },
    {
        "name": "Indian chicken protein pots",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a25/a25700df552ffa45b7eb5aed79867610.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f566b2eac8aa0e9a28fb064a9384a9ac24056512c739701977c7bcbbb96f8ea2",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lentils",
                "unit": "gram",
                "quantity": 90.0
            },
            {
                "name": "cherry tomatoes",
                "unit": "gram",
                "quantity": 160.0
            },
            {
                "name": "skinless chicken breast",
                "unit": "gram",
                "quantity": 150.0
            },
            {
                "name": "fresh coriander",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "tzatziki",
                "unit": "tablespoon",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Sambhar (Indian Lentil Stew)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/90b/90b1b51c02a4cff1783c5ddde66c562e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=bbd3612fd01fc2f1778ec27e8fdbf96b42638933be0be0462b313436806023b1",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "toor dal",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "ground turmeric",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "ground turmeric",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "fenugreek",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "canola oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "mustard seeds",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "dried red chile",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "curry leaves",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "chile powder",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "masala",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "yellow onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "tomato paste",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "tamarind",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "kosher salt",
                "unit": "tablespoon",
                "quantity": 1.5
            },
            {
                "name": "vegetable broth",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "baby carrots",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "english cucumber",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "cherry tomatoes",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "radishes",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "frozen peas",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "cilantro",
                "unit": "serving",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Indian Toastie Sandwich recipes",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/623/6237329c9d3fe9b1d301a878cb2dd97d?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=7065b2a0057e2f4b6ec899646d4abb4ff2c90373744d9329cb09eb7a473bec5a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "sandwich bread",
                "unit": "slice",
                "quantity": 2.0
            },
            {
                "name": "salted butter",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "mung beans",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "tomato",
                "unit": "slice",
                "quantity": 2.0
            },
            {
                "name": "chutney",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Monterey Jack",
                "unit": "ounce",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Baked Potato With Indian-Cured Salmon",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a4c/a4cf13baf62cedcedf1412edeac38caa.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0ea9c53583cde3d9ee9f9c6856e40fe68313401ce7df14867f9312c21669bee2",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "heavy cream",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "baking potatoes",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "fish",
                "unit": "pound",
                "quantity": 1.25
            },
            {
                "name": "milk",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "fresh dill",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "cayenne pepper",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "dry mustard",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "all-purpose flour",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Swiss Chard With Indian Lime Pickle",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/d50/d505b687a26793d6587bc136a3014349.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=23e8a2263711b23fed486e0bfeebcddb670583929f388d16ce212184fb9cdc6b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lime",
                "unit": "cup",
                "quantity": 0.125
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "extra-virgin olive oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "salt",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Swiss chard",
                "unit": "bunch",
                "quantity": 2.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "shallot",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "lemon zest",
                "unit": "teaspoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Indian porridge",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b38/b3861869ab545e5855d52c5a36da826c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f30da2362b6e5b7af32fd5d09aa6270b5eb6fe592887eef66e9c90467dbf29d1",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "wheat",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "milk",
                "unit": "cup",
                "quantity": 3.0
            },
            {
                "name": "turmeric",
                "unit": "pinch",
                "quantity": 1.0
            },
            {
                "name": "sugar",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Almonds",
                "unit": "nut",
                "quantity": 1.0
            },
            {
                "name": "shredded coconut",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "South Indian Cauliflower Bake",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/20d/20db3400fe6bd2b11b942378366d4c00.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2c8b68f5d9caf1c30591b8876318662d4a3c9f44a8dff69c334778d2632dbeaf",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cauliflower",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "olive oil",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "sambar powder",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "mustard seeds",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "curry leaves",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "paprika",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "hing",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "starch",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "lemon rind",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "coriander",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Southern Indian Chicken Curry",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/fb6/fb6cf6bba8e565f87feab2b054d32e12.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=422d54c9889734cd873774cb4ec14c636a6a468d65ba48431cad94b3c8c0e73b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "corn oil",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "red onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "jalapenos",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.5
            },
            {
                "name": "fresh ginger",
                "unit": "piece",
                "quantity": 1.0
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 4.5
            },
            {
                "name": "boneless, skinless chicken breasts",
                "unit": "pound",
                "quantity": 1.75
            },
            {
                "name": "cayenne pepper",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "coriander",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "cumin",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "mustard seeds",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "kosher salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "peaches",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "unsweetened coconut milk",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "plain yogurt",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "flat bread",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pitas",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Indian Semolina Upma Recipe",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/061/061e00dcbab7df59bfc50f499d678356.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f937a142905ee39be4ad860ab11eb1e9b3289adebea251b2107e29dd30e85b70",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "semolina",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "ginger",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "shallots",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "butter",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "chili",
                "unit": "slice",
                "quantity": 3.5
            },
            {
                "name": "coconut milk",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "onion",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "cumin",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "curry leaf",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "kokums",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "vegetables",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "season",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Aloo Samose (Indian Spiced Potato Pastries)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b48/b4835fa9bfd145d94c5e0c63acd632a9.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8bf995fd64251766e5ba10c7cbae3ba323a73ce93b5f098c825523b20d0c0182",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "flour",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "kosher salt",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "canola oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "yellow onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "frozen peas",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "cilantro",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "piece ginger",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "chile",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "lemon juice",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "amchoor",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "anardana",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "coriander",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "cumin seeds",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "cayenne",
                "unit": "teaspoon",
                "quantity": 0.125
            },
            {
                "name": "potatoes",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "cilantro leaves",
                "unit": "cup",
                "quantity": 3.5
            },
            {
                "name": "mint leaves",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "chile",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "plain yogurt",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Canola oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Indian Plum and mint dip",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/914/91408a804c3e794b49a41f0149bda502.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0bf7d198814f4eabbe3f0e5449e88149c05c05a20471e48c310356f4767c88da",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "plum",
                "unit": "piece",
                "quantity": 15.0
            },
            {
                "name": "Mint leaves",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.75
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "sugar",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "cumin",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "Cashew nuts",
                "unit": "pcs",
                "quantity": 5.0
            },
            {
                "name": "green chilies",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Asafoetida",
                "unit": "pinch",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Indian Eggplant Sliders - Indian Street Food",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/908/9081d0a452e84bca803e76e660f1ada1.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=77a43f8a2ac13d0add6b8cd9711a6857ba1ee0d2d5ff91aa8ed7dfed7ad283d9",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "eggplant",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "frozen peas",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "tomato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "coriander",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "chili powder",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "coriander",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "red cabbage",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "peppers",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "spinach",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "mint leaves",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "coriander leaves",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "paprika",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "lemon juice",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "butter",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "buns",
                "unit": "pcs",
                "quantity": 6.0
            }
        ]
    },
    {
        "name": "Saag Paneer (Spinach With Fresh Indian Cheese)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/c21/c2189d8e3911a84ff78a7d23cb4a6379.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=26119935adb0dbb562cbdf4b26d6edaf75eb48b4c97280210c06814ca9241722",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "milk",
                "unit": "cup",
                "quantity": 8.0
            },
            {
                "name": "lemon juice",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "canola oil",
                "unit": "tablespoon",
                "quantity": 6.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 4.0
            },
            {
                "name": "piece of ginger",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "serrano chile",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "spinach",
                "unit": "cup",
                "quantity": 6.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "heavy cream",
                "unit": "tablespoon",
                "quantity": 6.0
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "cayenne",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "flatbread",
                "unit": "serving",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Indian Fudge (Besan Barfi)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a26/a26cc0161593ab57cd62457545d4878d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=373ba15257925f028d71d6369366e1bb80e3ffcf7cf566c6ddf49996968a0d17",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "ghee",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "chickpea flour",
                "unit": "cup",
                "quantity": 3.0
            },
            {
                "name": "confectioner's sugar",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "cardamom",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "nuts",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "chocolate",
                "unit": "cup",
                "quantity": 0.5
            }
        ]
    },
    {
        "name": "P0TATO MASALA inspried by indian masala (Vegetarian)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/567/567b9775c75cb55c19eb8ee5b87f0b8e.JPG?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0146b9f51ed5333219f06c8be4289bdfa3173ec16883d8f2e8a5f3a5b8a26ff6",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "shallots",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "garlic",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "ginger",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Curry paste",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "cinnamon",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "paprika",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "turmeric",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "Tomato sauce",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "potato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "green peas",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "naan",
                "unit": "pcs",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Indian red lentil and potato dhal",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/545/545d2bcb28ce46c29a13e789c95e007d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a431962bde7e841d493e6a369de1743a6f0112c5fd3cc58970206932f6aefba2",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lentils",
                "unit": "ounce",
                "quantity": 14.0
            },
            {
                "name": "potatoes",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "red curry paste",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "masala",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "tumeric",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "dried chili flakes",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "curry powder",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "sugar",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "minced ginger",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "tomatoes",
                "unit": "ounce",
                "quantity": 7.0
            },
            {
                "name": "coconut milk",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "cilantro",
                "unit": "handful",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Indian Pepper Chicken Roast in Cast Iron Skillet",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e89/e890d03847a483b3d032a805c1fed8b1.JPG?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190928Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d1dcc3916c47b56c8d5147f3830d2ef89b5959d7aa3c8c7d698771a264e7c266",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Chicken thighs",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "Green Chilies",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "Cilantro",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "Curry leaves",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "corns",
                "unit": "pcs",
                "quantity": 7.0
            },
            {
                "name": "Salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Cumin Seeds",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "spice mix",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Turmeric",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "Onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "Minced Ginger",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Extra virgin Olive oil",
                "unit": "tablespoon",
                "quantity": 3.5
            }
        ]
    },
    {
        "name": "The Ultimate Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/05f/05f6b1fbd22e92e2f7ba32026abe1714.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d68f70b1ed4ee578af7cbc49e510d0848c4804c5407a749527a2a87e444a0d26",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "flap steak",
                "unit": "pound",
                "quantity": 2.5
            },
            {
                "name": "ketchup",
                "unit": "burger",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Five Napkin Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b2e/b2e059571b84fae5afb9d30122a4e06e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=839a5177c7755a144ba99dacb8aafe9ec960543c0ad9eb55bbd82054abd8e47d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "ground chuck",
                "unit": "pound",
                "quantity": 3.75
            },
            {
                "name": "hamburger buns",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "Gruyere cheese",
                "unit": "ounce",
                "quantity": 6.0
            },
            {
                "name": "Onions",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "Aioli",
                "unit": "cup",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Lamb kebab burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/622/622a98136fdd0c1ef7fe1c515460a406.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d0733663ea7da699f7524466399014d379faf18a81d6ec3ade7ef2d078818187",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "fat-free yogurt",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "mayonnaise",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 1.0
            },
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 0.5
            },
            {
                "name": "lamb",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "burger buns",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "tomato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "gherkins",
                "unit": "gram",
                "quantity": 20.0
            },
            {
                "name": "red chilli",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "lettuce",
                "unit": "leaf",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Duck Burger Recipe",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/864/864a7b9542f12f6f9d371d12111ed955.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=72c5c64109c68a2b1ff8503f89d343d33dc6440852206f9a9dfa9346c676912a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "duck meat",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "duck fat",
                "unit": "ounce",
                "quantity": 1.0
            },
            {
                "name": "scallions",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "fresh ginger",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "five-spice powder",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "vegetable oil",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Swiss cheese",
                "unit": "slice",
                "quantity": 4.0
            },
            {
                "name": "Brioche",
                "unit": "roll",
                "quantity": 4.0
            },
            {
                "name": "mayonnaise",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Chipotle Veggie Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a69/a69cad6990431c2946a58ff17772995a.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=076a7d3776ae837198498c7487b94bbf78928e18c217a45400c73dfe7bcb496a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "burger bun",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "veggie burger",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "avocado",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "pico de gallo",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "apple",
                "unit": "pcs",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Baked Cheesy Burger Buns",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a2d/a2d6c940836b7050ef1967cfa30556f1.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b53363f8112aab375783425b87c908cbe13c2db97fdd783f374ad817ed479ae2",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "burger buns",
                "unit": "package",
                "quantity": 1.0
            },
            {
                "name": "Egg",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "Milk",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Cheddar cheese",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "Parmigiano Reggiano",
                "unit": "tablespoon",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Pork And Apricot Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/111/111e350989a5baae23107f85d03b707c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=fa39aeaec571a9a46fe7a78e937d40d3d0b9f751c47441277ed530a1914fc522",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "dried apricots",
                "unit": "gram",
                "quantity": 25.0
            },
            {
                "name": "lean pork",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "burger bun",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "naan bread",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "salsa",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Italian Turkey Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/193/193da5a200999d38b305986887d880e7.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0fd0dd56d5824c9b40af505d032c58d61c67d52141a4aceb72af8eb6e71ef090",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "turkey burger",
                "unit": "pattie",
                "quantity": 4.0
            },
            {
                "name": "kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "provolone cheese",
                "unit": "slice",
                "quantity": 4.0
            },
            {
                "name": "bell peppers",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "marinara sauce",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "fresh basil",
                "unit": "leaf",
                "quantity": 8.0
            }
        ]
    },
    {
        "name": "Southwestern Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e24/e24aa386bb5dc6652322e16bdd7a898a.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=3c6a2abec1d0a935da1ab9f3429878a67f81a03ccb1bc8436363749e66369717",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Vegetable oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "ground sirloin",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "red bell pepper",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "egg white",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "hot sauce",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "corn kernels",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "diced tomato",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "cilantro",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "lime juice",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "burger buns",
                "unit": "pcs",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Southwestern Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/3ed/3ed39914eeaaa933b1d89f2386f3a952.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8686a58711b8d43bd686d3a29abbfb6c025c8b95166e137144c7af1981028abd",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Vegetable oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "ground sirloin",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "red bell pepper",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "egg white",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "hot sauce",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "corn kernels",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "diced tomato",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "cilantro",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "lime juice",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "burger buns",
                "unit": "pcs",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "The Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/1cf/1cfafdf016833ff79ca1e9c30604689d.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=318ef74f89c0d8e44b8c992a48bb533acdf51ee16ae865eb4279784b71c3bcdd",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beef short rib",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "beef chuck",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "vegetable oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Bibb",
                "unit": "leaf",
                "quantity": 4.0
            },
            {
                "name": "tomato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "potato starch",
                "unit": "ounce",
                "quantity": 9.0
            },
            {
                "name": "bread flour",
                "unit": "ounce",
                "quantity": 4.5
            },
            {
                "name": "sugar",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "baking powder",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "kosher salt",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "baking soda",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "milk powder",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "garlic powder",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "egg",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 6.0
            },
            {
                "name": "butter",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "sesame seeds",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "chives",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "ketchup",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "mayonnaise",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Dijon mustard",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "bread-and-butter pickles",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "capers",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "parsley",
                "unit": "bunch",
                "quantity": 1.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Mushroom Bison Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/943/943dd3096dba198c5d5f75078e36cef8.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=c64e91888a3af33beb3f447ddc1d0da3ae45de1ddc1de655a12f26a054157c63",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "bison",
                "unit": "ounce",
                "quantity": 4.0
            },
            {
                "name": "portobello mushroom",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "red onion",
                "unit": "slice",
                "quantity": 1.0
            },
            {
                "name": "tomato",
                "unit": "slice",
                "quantity": 2.0
            },
            {
                "name": "lettuce",
                "unit": "leaf",
                "quantity": 2.0
            },
            {
                "name": "Multi-Grain Flatbread",
                "unit": "pcs",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Annie Chuns' Ramen Burger Bun",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/bd9/bd9ca793c6f475e9eef530f12e9e072d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b5d37b16d9de9e7b78681a6be5d3302a9f5fb6c0b014d87d9b034b540f758ad6",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Noodles",
                "unit": "package",
                "quantity": 1.0
            },
            {
                "name": "egg",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "ground beef",
                "unit": "ounce",
                "quantity": 4.0
            },
            {
                "name": "Lettuce",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "tomato",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Sriracha Turkey Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/cbd/cbd8ab9bb13f331d715774a79140db94.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=bd46f560b2f50fbdfabce096fd52bd597159e048533a48fa5afa764c4c1106da",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "turkey burger",
                "unit": "pattie",
                "quantity": 4.0
            },
            {
                "name": "kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepperjack",
                "unit": "slice",
                "quantity": 4.0
            },
            {
                "name": "avocados",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "lime",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "Sriracha",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Duck confit burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b7c/b7c35ab1318104f03c0db086c77a961c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=c8fb136fe291c8941200ec62a3dca58a711df366a97d2b1b16e238667e2f541d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "marmalade",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "duck",
                "unit": "gram",
                "quantity": 500.0
            },
            {
                "name": "burger buns",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "Dijon mustard",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "salad leaves",
                "unit": "gram",
                "quantity": 80.0
            }
        ]
    },
    {
        "name": "Beef Burger With Grilled Kale",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e77/e77c1b7aa06524b22268ebfa6c5af181.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=11597cdc597fc1448b4d5db0bb5eaafdff447f67fa38054fee4b6d16ef085129",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "ground sirloin",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "steak sauce",
                "unit": "teaspoon",
                "quantity": 4.0
            },
            {
                "name": "sea salt",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "blue cheese",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "kale",
                "unit": "leaf",
                "quantity": 4.0
            },
            {
                "name": "burger buns",
                "unit": "pcs",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Lamb Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/d47/d47b0237c0542aeb6d1581dc0bd5e957.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=66bf08ca9e1ce56845d00487a94931000b6cfc5a52988002aaece7fd465ccb6d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "ground beef",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "ground lamb",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "grapeseed oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "feta",
                "unit": "slice",
                "quantity": 4.0
            },
            {
                "name": "sour cream",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "cucumber",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "red onion",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "diced tomato",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "white pepper",
                "unit": "pinch",
                "quantity": 1.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "buns",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "Lettuce",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "tomato",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "5 Napkin Burger's IPA Blondie Milkshake",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/def/defa7d3f2c2e8a509967c4cbaaabf2c3.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=e25acdc2231e92470df7d8fd9fd54a8b1c1efe027f5606a9c6320bb19dcba035",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "vanilla ice cream",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "beer",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "butterscotch sauce",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Veggie Burger Salad",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/1f2/1f205faf3a1f6d22933c80d000fe765b.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=6ef3945d8cc552bad88a345f88fb0535e22cedb22ce888bafd3dc95bf24d0f5f",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "veggie burger",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "mixed greens",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "avocado",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "hearts of palm",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "yellow pepper",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "shiitake mushrooms",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "yellow onions",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "dijon mustard",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "olive oil",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "pepper",
                "unit": "teaspoon",
                "quantity": 0.75
            }
        ]
    },
    {
        "name": "Bulgogi and Kimchi Burger",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/231/231bdb680e8f48a8c509c97ba425c9c8.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190930Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ab9485b16bb8e65c8dba4716c0d84b3958e68b9add6be4947e82b77e627105d5",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "sesame seeds",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "soy sauce",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "gochujang",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "sesame oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "scallions",
                "unit": "pcs",
                "quantity": 5.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 5.0
            },
            {
                "name": "ginger",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "rice wine vinegar",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "brown sugar",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "ground beef",
                "unit": "pound",
                "quantity": 1.5
            },
            {
                "name": "burger buns",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "kimchi",
                "unit": "ounce",
                "quantity": 14.0
            }
        ]
    },
    {
        "name": "Pizza Dough",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/284/2849b3eb3b46aa0e682572d48f86d487.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=3bcb9cdd3a62f763e2d91068c3d2f7bca6eb942de59c48335ce0e799b25fb686",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "bread flour",
                "unit": "cup",
                "quantity": 3.75
            },
            {
                "name": "Yeast",
                "unit": "gram",
                "quantity": 10.0
            },
            {
                "name": "Table Salt",
                "unit": "gram",
                "quantity": 5.0
            },
            {
                "name": "Sugar",
                "unit": "teaspoon",
                "quantity": 0.75
            },
            {
                "name": "Sugar",
                "unit": "gram",
                "quantity": 3.0
            },
            {
                "name": "water",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "extra-virgin olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "yellow onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Heavy Cream",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "Kosher Salt",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "fresh thyme",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "diced tomatoes",
                "unit": "ounce",
                "quantity": 7.0
            },
            {
                "name": "Canned Tomatoes",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "Extra Virgin Olive Oil",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Kosher Salt",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "Red Pepper Flakes",
                "unit": "pinch",
                "quantity": 1.0
            },
            {
                "name": "fresh basil",
                "unit": "leaf",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Pizza Frizza recipes",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/94a/94aeb549b29ac92dced2ac55765f38f9?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a2b900bd32c1f8f05859ced72d2feb608ccf45f810f5fba42af872abab973ac4",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Pizza Dough",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "sugar",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Margarita Pizza With Fresh Mozzarella & Basil",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/d72/d72d1b7dd988e3b340a4b90ed3d56603.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a32521a6732d65de3d623d6a112f8f589d3db2806acb04928e4b49879b41ad3a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza dough",
                "unit": "ball",
                "quantity": 1.0
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 0.875
            },
            {
                "name": "mozzarella",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "basil",
                "unit": "leaf",
                "quantity": 10.0
            }
        ]
    },
    {
        "name": "White Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/dfe/dfe2e44c86334a3a3a5f774dda576121.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=64c7dbc4da525e28ac0abe1d5e4ea37dd4c9ecacdfebdca41a3c907eec2dbe14",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza dough",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "pesto",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "whole milk ricotta cheese",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "cheese",
                "unit": "ounce",
                "quantity": 4.0
            },
            {
                "name": "spinach",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "ground pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Grilled BLT Pizza recipes",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/2ac/2ac98d88117ff8f2327d302ab290b164?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b07573058f4af868dcfe211c80c7d8c74aceab28c65b3244736707fdb8aafae8",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza dough",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "pizza",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "mozzarella",
                "unit": "ounce",
                "quantity": 4.0
            },
            {
                "name": "bacon",
                "unit": "slice",
                "quantity": 4.0
            },
            {
                "name": "heirloom tomato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "red leaf lettuce",
                "unit": "leaf",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Pizza 6: Pan-fried Hawaiian Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/826/8265ed2a01be31faf14bc65a816b11cf.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=32a9fc8718663ca299bfc982ad17d1e354f7d36d70fdf31e63009134a05327b4",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "ham",
                "unit": "ounce",
                "quantity": 4.0
            },
            {
                "name": "pizza dough",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "mozzarella",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "pineapple",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "fresh basil",
                "unit": "leaf",
                "quantity": 4.5
            }
        ]
    },
    {
        "name": "Chorizo, caper & rocket pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/7fe/7fee72cbf470edc0089493eb663a7a09.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=9b634d3cf318ae363a77d5f1a8a3ef474d31c3e03ae66e44cc111961038cfe5b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza base",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "pizza sauce",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "chorizo",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "capers",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "cherry tomatoes",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "rocket",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "olive oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Resuscitated Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/c6f/c6f48f4c041638ab25e1becb42fabb52.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d904f53447938947f06a19700868a90a149bea85ea5f3c10a7f9c4d42d2e6138",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Gruy\u00e8re cheese",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "pizza",
                "unit": "slice",
                "quantity": 1.0
            },
            {
                "name": "bacon",
                "unit": "slice",
                "quantity": 2.0
            },
            {
                "name": "egg",
                "unit": "pcs",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Bunny Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ca5/ca52cfedc66380dccc14be7bd80b9928.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=afdc0d4b620a178b2f21793f3278c605e5ef4bf4bec9991d92ad4c2785375d2a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Cornmeal",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "whole-wheat pizza dough",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "mozzarella cheese",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "Kalamata olives",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "cherry tomatoes",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "shiitake mushroom",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "green bell pepper",
                "unit": "strip",
                "quantity": 6.0
            }
        ]
    },
    {
        "name": "Ground Chicken Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/705/7055effa4bd63c8a4fcbe2881ab85326.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ffb777b83329da498656a63a099bce6476b978f6e02eddb9adbaf666fe0e1f69",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "olive oil",
                "unit": "milliliter",
                "quantity": 25.0
            },
            {
                "name": "ground chicken",
                "unit": "ounce",
                "quantity": 12.0
            },
            {
                "name": "mushrooms",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "green pepper",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "pizza crust",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "provolone cheese",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "seasoning",
                "unit": "milliliter",
                "quantity": 5.0
            },
            {
                "name": "pizza sauce",
                "unit": "can",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Pizza Cones",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/bda/bdafe92307cbd191973509df4f6d9955.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a30a1316fd5cbb8492b76d70b00b2daa540024e0290130d15a9bb09d16d55ef5",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza crust",
                "unit": "ounce",
                "quantity": 13.800000190734863
            },
            {
                "name": "meatballs",
                "unit": "pcs",
                "quantity": 24.0
            },
            {
                "name": "pizza sauce",
                "unit": "ounce",
                "quantity": 14.0
            },
            {
                "name": "pepperoni",
                "unit": "ounce",
                "quantity": 3.5
            },
            {
                "name": "green bell pepper",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "cheese",
                "unit": "ounce",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Pizza Rolls",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/c46/c467b80ff0c33bb99a13f371d4f88673.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=3afdb61b64b369602091814883411b6149683ee65191192a73f186cc4283dd84",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza dough",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "marinara sauce",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "pepperoni",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "dried oregano",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "mozzarella",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "Parmesan",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "red pepper flakes",
                "unit": "pinch",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Pizza Roses",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/055/0552b8e2a2b2edda12907f9653973ca5.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=44d0e7f1861613ccfebd32e33231ed4a63fa3bc3f7f7a15c81c1af133e592110",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cooking spray",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "dough",
                "unit": "pizza",
                "quantity": 1.0
            },
            {
                "name": "All-purpose flour",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "mozzarella",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "pepperoni",
                "unit": "ounce",
                "quantity": 12.0
            }
        ]
    },
    {
        "name": "Pizza Margherita",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/eee/eee63ff62c13d50ebe4684ff4380853f.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=40a517dd15a285038dc4289fc7f8cd09ec7b64fc353de8e4f28d375fa1f813f1",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Boboli pizza",
                "unit": "crust",
                "quantity": 1.0
            },
            {
                "name": "flour",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "mozzarella",
                "unit": "ounce",
                "quantity": 2.0
            },
            {
                "name": "extra-virgin olive oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "fresh basil",
                "unit": "leaf",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Pizza Toast",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a3e/a3e1050df0a76464014be868bc7de5a8.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=aa9928d614b7fe52d0f34fb8eb1851faefdafced3af9566e03980522e11c0450",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "bread",
                "unit": "slice",
                "quantity": 6.0
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "mozzarella",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "pepperonis",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "Parsley",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Mini Pizza Rolls",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/8b5/8b58bcc8cc59a8ba5fe285fd3d49bffd.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2b2c8bed20449150473dbacd7fa15dfd9bd649f59b42ef69c9ca05e4ab773359",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "refrigerated biscuits",
                "unit": "ounce",
                "quantity": 7.5
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "mozzarella cheese",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "pepperoni",
                "unit": "tablespoon",
                "quantity": 1.5
            }
        ]
    },
    {
        "name": "Grape Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/65f/65f89b23ec4d2b7d548276f2b08277da.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ccc2e36c879d05ed366e0c1af2d4a8f1bedb8c607de7d02764d20558870e4402",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza dough",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Grapes",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "Parmesan",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "prosciutto",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "rosemary",
                "unit": "teaspoon",
                "quantity": 1.5
            }
        ]
    },
    {
        "name": "Grilled Half-and-Half Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/471/471f55aa4873b6dda574da1e5e6f1ddd.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=bc9d09d6098aaa9e4176e1c3182d97087613ebbd6a7ab003dc163ca24068c575",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza crust",
                "unit": "can",
                "quantity": 1.0
            },
            {
                "name": "Cooking spray",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pizza sauce",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "mozzarella cheese",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "pepperoni",
                "unit": "cup",
                "quantity": 0.5
            }
        ]
    },
    {
        "name": "Pizza Primavera",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/530/53047bf06754eb8a5f75920b378bc919.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=342332eabb38f0d3cc7e66740c8856bf661d2a8a00b19e3b740b61828fd94648",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "asparagus",
                "unit": "bunch",
                "quantity": 1.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Pepper",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "pizza dough",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "Fontina cheese",
                "unit": "ounce",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Margherita Pizza",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ed0/ed0b3396a486c74d1e81f99c6573b747.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190932Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1bd7ec2f03ab9314e472c621cfedf177072e4d275e23082d0c25e14b0e6cc2f0",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cornmeal",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Pizza Dough",
                "unit": "crust",
                "quantity": 1.0
            },
            {
                "name": "tomato sauce",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "mozzarella",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "fresh basil",
                "unit": "leaf",
                "quantity": 5.0
            }
        ]
    },
    {
        "name": "Herbed Egg Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/8f2/8f2918c0aed024a921b3a17c1aac8590.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=cd99cf94ecfbf700de82ef584bd794b99e35c45e2f4ac300ee7721d32dee8910",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cooked egg noodles",
                "unit": "ounce",
                "quantity": 12.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "parsley",
                "unit": "tablespoon",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Cabbage And Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/478/478f2d254440acd1914edfce47e4c65d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=bbb7e23dcd340f622568f82c5cc9345cd20bf508174d606b4b88eab474cf5bb1",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "yellow onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "cabbage",
                "unit": "head",
                "quantity": 0.5
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 6.0
            },
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "wide egg noodles",
                "unit": "pound",
                "quantity": 0.5
            }
        ]
    },
    {
        "name": "Easy Buttered Noodles recipes",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6e6/6e67266d560054284b40d19589294488?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=22fb841185ea44c69b1d30de7eb616eba3bfa0bf304c1961eac4b606a2ed0413",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg noodles",
                "unit": "pound",
                "quantity": 0.5
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Parmesan cheese",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "parsley",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Mint and Scallion Soba Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/3e1/3e1122257b883aff0eb28ce9f2bd9810.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=94c246c5ed26661e7b18d99c4dfe89a800eb1b077860bed7f3ddfe896a7628c1",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "soba noodles",
                "unit": "ounce",
                "quantity": 12.0
            },
            {
                "name": "rice vinegar",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "soy sauce",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "sugar",
                "unit": "teaspoon",
                "quantity": 1.25
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.75
            },
            {
                "name": "mint",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "scallions",
                "unit": "bunch",
                "quantity": 1.5
            }
        ]
    },
    {
        "name": "Singapore noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/57e/57e137af9688ef35921282da8a1bff84.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=cd11243f751261510ac082c1a54722fb6d687e7b96feee4507cd1996a6d45b0a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pork tenderloin",
                "unit": "gram",
                "quantity": 300.0
            },
            {
                "name": "soy sauce",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "sherry",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "light brown sugar",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "five spice powder",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "sunflower oil",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "egg noodles",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "red onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "red pepper",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "shiitake mushrooms",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "ginger",
                "unit": "gram",
                "quantity": 20.0
            },
            {
                "name": "curry powder",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "prawns",
                "unit": "gram",
                "quantity": 200.0
            },
            {
                "name": "spring onions",
                "unit": "pcs",
                "quantity": 10.0
            }
        ]
    },
    {
        "name": "Butternut Squash Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ac6/ac6eb2d1aa21bac3a48fe0e8dc38f4c5?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a9c37ba545ff439fc1b407a947859dbb6954f32f58ad9ca8a53008eea0a57e52",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "extra-virgin olive oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "squash",
                "unit": "cup",
                "quantity": 5.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "crushed red pepper",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "fresh thyme",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Parmesan cheese",
                "unit": "cup",
                "quantity": 0.75
            }
        ]
    },
    {
        "name": "Glazed Drumsticks With Rice Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/26f/26f7416656d3b5bd35cf63ffc82e680e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=16d0c0d973a9f272fd244dc3cfde496d038d62aad7fdf8db64b74bb3f1ae1aa4",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "rice noodles",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "canola oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "chicken drumsticks",
                "unit": "pcs",
                "quantity": 8.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "low-sodium soy sauce",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "rice vinegar",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "brown sugar",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "napa cabbage",
                "unit": "head",
                "quantity": 0.25
            },
            {
                "name": "scallions",
                "unit": "pcs",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Ranch Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6bc/6bc5400474e2108f7253976306818a22.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=606fda2beeb33ea45d614c5da5bdd9f42d13b2b140dc2e42f6b6ea498c50b031",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg noodles",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "butter",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "sour cream",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "Ranch dressing",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "Parmesan cheese",
                "unit": "cup",
                "quantity": 0.5
            }
        ]
    },
    {
        "name": "Perfect Buttered Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/397/3972ce504e1aa154bf771d6a70ab1f87.png?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=763bf89c4f51c4d13a61cf09132dc4a0f50ef30bfb02df045904f5312a8fcf11",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg noodles",
                "unit": "ounce",
                "quantity": 12.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Parmesan",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Sesame Kelp Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/139/13949387cb39c501711f7395321a725d.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=754f83faea70f72a75c838117a105aacd52d4848e85a66418ff99b3638edc002",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "noodles",
                "unit": "package",
                "quantity": 1.0
            },
            {
                "name": "almond butter",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "toasted sesame oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "vinegar",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "agave nectar",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Egg Noodles with Mushrooms",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6bd/6bd8b8770fe1f0517954d49b9b3bf47c.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=f0e47b52e48aa63a39de11171a14beedc9e79c4fae1cfc2ca09004c9c5440852",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "wide egg noodles",
                "unit": "pound",
                "quantity": 0.5
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "white mushrooms",
                "unit": "pcs",
                "quantity": 8.0
            },
            {
                "name": "shallot",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "parsley",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Caraway Egg Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/64c/64c157521e4918e68ea1659c1e1482b0.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b828108df5a5f492445471bcf548b8c2c0fa80c24645cb33349573a025c53eb5",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Coarse salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "egg noodles",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "caraway seeds",
                "unit": "teaspoon",
                "quantity": 4.5
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Asian Noodles With Vegetables",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a8a/a8a108270338ff41028800e45d43bcf2.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=98065a68995b2abb80b717197013351c68bcb9ed15fed165ccd5792ad27d5ffe",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "ramen noodles",
                "unit": "ounce",
                "quantity": 9.0
            },
            {
                "name": "canola oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "bok choy",
                "unit": "cup",
                "quantity": 4.0
            },
            {
                "name": "carrot",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "reduced-sodium soy sauce",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "sugar",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "dark sesame oil",
                "unit": "teaspoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Sweetpotato Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/995/995bebc526dfd3cfb61424f4ffb814ff.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=74db624aae21fea659e5e75cbdcbdc756aa01a8b9f682e90f59a7f16cbc4b459",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "sweetpotatoes",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "shallot",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "button mushrooms",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "red pepper flakes",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "chives",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Dandan Noodles (Tantanmen Ramen)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b04/b045a5d7a2919d80f04fcf1addddc71a.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=846decbe7f59a01ab097fd29ebc0dd7fd153fcebe2b969a09768d2bc23922685",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "noodles",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "bean paste",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "peanut butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "peppercorns",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "white pepper",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "broth",
                "unit": "cup",
                "quantity": 6.0
            },
            {
                "name": "ground pork",
                "unit": "pound",
                "quantity": 0.5
            },
            {
                "name": "garlic",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "ginger",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "green onions",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "sesame oil",
                "unit": "teaspoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "'Dragon prawn' noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ec3/ec3deb1c430f67fb18599b0fe2d5b822.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=42b011242c514b945e9b78b72dd091401743d7244ab744b037e61a95db4ccc1b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lobster",
                "unit": "gram",
                "quantity": 650.0
            },
            {
                "name": "oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 5.0
            },
            {
                "name": "ginger",
                "unit": "piece",
                "quantity": 1.0
            },
            {
                "name": "yellow bean",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "light soy sauce",
                "unit": "tablespoon",
                "quantity": 4.0
            },
            {
                "name": "rice wine",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "wheat noodles",
                "unit": "gram",
                "quantity": 350.0
            },
            {
                "name": "spring onions",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "toasted sesame oil",
                "unit": "dash",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Spicy Thai Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/690/6900195e42b9d9b8c74a71292673e0d0.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=16127475223785ef126d5255ba858b57fc6a216a0982a19b7adbdd4054040384",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "brown rice noodles",
                "unit": "ounce",
                "quantity": 3.0
            },
            {
                "name": "cooking spray",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "skinless, boneless chicken breast half",
                "unit": "ounce",
                "quantity": 7.0
            },
            {
                "name": "sweet pepper",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "carrots",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "peanut butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "reduced-sodium soy sauce",
                "unit": "teaspoon",
                "quantity": 5.0
            },
            {
                "name": "crushed red pepper",
                "unit": "teaspoon",
                "quantity": 0.375
            },
            {
                "name": "green onion",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "Lime",
                "unit": "wedge",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Herb Buttered Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/397/3978d1d0cd29a3dc61e6c4da1bcb6809.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=562529b20d5c5c1fd271469c43e659c9928d60dc7cec4722b232d901f4beab0b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg noodles",
                "unit": "ounce",
                "quantity": 12.0
            },
            {
                "name": "parsley",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "thyme",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Kosher salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Salmon with Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a69/a69cad6990431c2946a58ff17772995a.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d77577ce5df1de18d2a4e9dc3bd86443404bfac2ea5aea908728f84f14f63ce2",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "wild salmon",
                "unit": "ounce",
                "quantity": 16.0
            },
            {
                "name": "egg noodles",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "lemon",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "extra-virgin olive oil",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "poppy seeds",
                "unit": "teaspoon",
                "quantity": 1.5
            }
        ]
    },
    {
        "name": "Herbed Egg Noodles",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/258/258ce8013920fe2b2f71f7e072a38844.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=4c808258ab7a79fa7ca35f79ebdf66c3b8d7599f67650c46cfd09e1715aeaffa",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg noodles",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "Coarse salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "ground pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "parsley",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "fresh thyme",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Pasta Frittata Recipe",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/5a5/5a5220b7a65c911a1480502ed0532b5c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=1f06984897887d9035d0c41e8fd3282bd8567a01d580f556970fd9a9e7e207cc",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pasta",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "eggs",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "pasta",
                "unit": "cup",
                "quantity": 0.5
            }
        ]
    },
    {
        "name": "Pesto Pasta Salad",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/210/2106c43a5c9be95afb2a432cc5c42a54.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ada1cff52819ae592ef21346a8980b5d632006b773625a827c2990c2b5ded883",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Coarse salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pasta",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "basil pesto",
                "unit": "ounce",
                "quantity": 8.0
            }
        ]
    },
    {
        "name": "Guacamole Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/c3b/c3b2202bcd51fcb362abf83a683ac758.JPG?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=48ee188094856e1481a92ed8b8c50e7afb82bb390213a9cae0433d21260994de",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "avocado",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "pasta",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "scallion",
                "unit": "pcs",
                "quantity": 0.25
            },
            {
                "name": "tomato",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "lemon",
                "unit": "pcs",
                "quantity": 0.25
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Beany Pasta Pot",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/652/652e7a61d5148114597c58ddcee15bd0.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d82ef7f8f4567a8a31dc17ce55ad815b9d1ba9033959b1447eca1f2e034dda44",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "borlotti beans",
                "unit": "gram",
                "quantity": 290.0
            },
            {
                "name": "passata",
                "unit": "milliliter",
                "quantity": 300.0
            },
            {
                "name": "tomatoes",
                "unit": "gram",
                "quantity": 410.0
            },
            {
                "name": "cooked pasta",
                "unit": "gram",
                "quantity": 300.0
            },
            {
                "name": "apple",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "sunflower oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "pesto",
                "unit": "tablespoon",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Pasta Jarlsberg",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/6e8/6e855ffa1d3114d5719ae7fdfcf1c932.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=035016b9b426fc791771c3ecc161589b45dba5100a6bfb99ba39496248dad0ed",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "fresh angel hair pasta",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 10.0
            },
            {
                "name": "jarlsberg cheese",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "chervil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Pasta Puttanesca and Tuna",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/407/407dc7452b5a12641ecb4e6552713b95.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=c9f9de2754bf11bc2afd9ddd68b0c85e68a6efffbc112540d520ccedecca2899",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cellentani",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "pasta sauce",
                "unit": "jar",
                "quantity": 1.0
            },
            {
                "name": "light tuna in oil",
                "unit": "can",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Peppery Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b33/b33cd4d97bae26bee68f0c7988eb4c09.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=c625721466c424dd73859a96c56e604bf6b87f73fa8244eff19639675cd39727",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "extra-virgin olive oil",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "pepper",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "angel hair pasta",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "lemon",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "manchego",
                "unit": "ounce",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Pasta Carbonara Light",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/032/032ebd83be5ffcfec66a569b75d45e7e.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5ef6164158bd9e2423be4169f26c13afacc1913839b13686e79feb3646a3ca22",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Vegetable-oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "turkey bacon",
                "unit": "slice",
                "quantity": 6.0
            },
            {
                "name": "egg yolks",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "nonfat plain Greek yogurt",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "Parmesan",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "black pepper",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "frozen peas",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "pasta",
                "unit": "ounce",
                "quantity": 16.0
            },
            {
                "name": "half-and-half",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "fresh basil",
                "unit": "cup",
                "quantity": 0.25
            }
        ]
    },
    {
        "name": "Pasta with Saffron",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e0d/e0dd0ae4af13dd44fdaeaaaea4a1ac60.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=7dd5221d900bf7e3a184a6e17bf83791d0122b7bef406e02d4a6bf24801c1b4d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "bow-tie pasta",
                "unit": "ounce",
                "quantity": 12.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "cream",
                "unit": "cup",
                "quantity": 0.75
            },
            {
                "name": "saffron",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Parmesan cheese",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Pasta con Ceci (pasta with chickpeas)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a33/a332121eaa60a84c93174a5ee54e06b2.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b50d0dd56fc5aadd433da6d151ee309543ad51a28448175aea9fac465f132c3d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "chickpeas",
                "unit": "pound",
                "quantity": 2.0
            },
            {
                "name": "pasta",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "parsley",
                "unit": "bunch",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "baking soda",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Tomato & Nectarine Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/f84/f84b12f1ddc9aff7b6e47f4521cfed9a.png?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d24c0649338d73d8015d8d024081e8589f6313557ad184d527cc05d503afc93b",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Pasta",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "Cherry Tomatoes",
                "unit": "cup",
                "quantity": 3.0
            },
            {
                "name": "Nectarines",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "Garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "teaspoon",
                "quantity": 0.125
            },
            {
                "name": "Lemon Juice",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "Balsamic Vinegar",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "Fresh Basil",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "Water",
                "unit": "cup",
                "quantity": 0.75
            }
        ]
    },
    {
        "name": "Tofu Pesto Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/aa2/aa204576d07b5313787b78afe22d5bca.png?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=543f62d4cec1155bb959a58916566a21931b5d127947297f7d917671fca543b3",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Basil",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "Firm tofu",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "Parmesan",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "Walnuts",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Garlic",
                "unit": "clove",
                "quantity": 3.0
            },
            {
                "name": "Lemon juice",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "Olive oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Gluten-free pasta",
                "unit": "ounce",
                "quantity": 8.0
            }
        ]
    },
    {
        "name": "Cauliflower pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/84f/84f8c76e37cfa5886cf01981b293e6cc.JPG?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=fdd0edd2774772cdf0ecac8be91e9c1c415f6c7265cee2f6dbe7fe3834841d82",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cauliflower",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "chillies",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "olive oil",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "parsley",
                "unit": "handful",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pasta",
                "unit": "packet",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Tutu Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/539/539cd68dfc6b347f0e3715d5f610e37a.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=66f55a8ef38980d5df5b1410a6025ad683597ce582718820b67f1ca22bac515a",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "plum tomatoes",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "olive oil",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "pasta",
                "unit": "pound",
                "quantity": 0.75
            },
            {
                "name": "egg",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Pink Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/4e9/4e939a6c7aab7c9702955942378d1712.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8f9a92bc9947d0b640e22025d5e139fc7b7722c8caf98a70982da03531dd6aa7",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pasta",
                "unit": "gram",
                "quantity": 500.0
            },
            {
                "name": "cream",
                "unit": "milliliter",
                "quantity": 300.0
            },
            {
                "name": "Tomato paste",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Vegetable oil",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Oregano",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "dash",
                "quantity": 1.0
            },
            {
                "name": "Pepper",
                "unit": "dash",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Breakfast Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/c66/c66534850ceb54f7cc3055704ebb0fa9.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=7d6dc02d44157b1b2d776d16cf3411ec70460a22f41daf437ce0f254171e8749",
        "category": "breakfast",
        "ingredients": [
            {
                "name": "Pasta",
                "unit": "pound",
                "quantity": 0.25
            },
            {
                "name": "Eggs",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "Parmesan cheese",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "Spinach",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "chili",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Butter",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Pasta e Ceci (Pasta with Chickpeas)",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/7dd/7dd3082908d491eba6015e2502134137.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=3dde79edf3f08751885bcafc4fd40e46b4a4340aa5bf83d0c4092c40d73d3623",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "dried chickpeas",
                "unit": "ounce",
                "quantity": 7.0
            },
            {
                "name": "bay leaf",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 1.0
            },
            {
                "name": "fresh rosemary",
                "unit": "sprig",
                "quantity": 1.0
            },
            {
                "name": "dried chili",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "tomatoes",
                "unit": "ounce",
                "quantity": 7.0
            },
            {
                "name": "pasta",
                "unit": "ounce",
                "quantity": 7.0
            },
            {
                "name": "Extra virgin olive oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Commodity Pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/a33/a332121eaa60a84c93174a5ee54e06b2.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=b50d0dd56fc5aadd433da6d151ee309543ad51a28448175aea9fac465f132c3d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "spaghetti",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 5.0
            },
            {
                "name": "parmesan cheese",
                "unit": "cup",
                "quantity": 0.625
            },
            {
                "name": "ground pepper",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "water",
                "unit": "quart",
                "quantity": 5.0
            },
            {
                "name": "salt",
                "unit": "dash",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Princess pasta",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/2d6/2d697449a272611f3c132290a5b455b3.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=57325f57a46989e15e1f094e153cac9dc9fdcf1c2721c7928a1521c7d3f5f555",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "beetroot",
                "unit": "gram",
                "quantity": 500.0
            },
            {
                "name": "ham",
                "unit": "gram",
                "quantity": 400.0
            },
            {
                "name": "blue cheese",
                "unit": "gram",
                "quantity": 300.0
            },
            {
                "name": "sweet onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "pasta",
                "unit": "gram",
                "quantity": 350.0
            }
        ]
    },
    {
        "name": "Grain Free Pasta Tricolore",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/93e/93efed95a96679732343a4a7f70d2afd.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJGMEQCIEzGgOuaFi6kuq7mO10w4tqdAkmrdaCtA7Ul%2B%2FqsBdftAiBaYKUSXmizxXLQ3t07SoAyMPsBu7F8VKFQJNkX7LKlTirCBQiT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDE4NzAxNzE1MDk4NiIMPLsRenxVAy84UWNNKpYFCjtMqUQ58nRymE2GzoDOFEXSxr59kw%2FAeG53PQq3MU2G18vLL%2FzoR%2FoXu59Jim%2Fe%2F%2F9JfjOPKpHx4WeuSEY2hH14qgp5u5DjPp8V1b0X65wh%2FzvMw8FP3EqsOouZTo9EAIWhym2knXqVj%2FfVPaw1mdj5lHAuzMlEuq%2FXHVN8BJ1PAFvK3PTRD4s05MqRL0thUyHdk1H9JWNWOwIB6CEp39%2FEGMIBE1X8Gs4IV3x5gkxTcuR28ENKNrutoD7Si1VtmEGYe7uAqEKxfCBcJ8prTGq1g%2F3DcpzZG%2BDFH91RcOM73D%2FVx142VLAJTEht8HAmPIJhuuTVk5z2RstTXx%2BHFD2AThvC03MRlhLY8LJsoqT9zlKWV021RZyqymzCswkpcpFV%2FxHQG6oIsBi%2FCvGRB%2BDexUZS%2F1eHLkSsQrCGYKYqO89iXqr0JTEMt%2F0wYh%2BAhsD5Z5mCYCzE1V9t3onrcUfxMioH%2FG7avz5dd1uSh2XXwdBaHjn059PYMHymjTgLN2ZEk53ysFfXfbIpyJ5%2Bspr4T6W3C7ggRu%2BDEWagzoftwoj0kQrDB%2BmBxUMh%2FcbtK0hyjMqn11YtovP4QoNRMn90EJ9MS6Rxk2F5DW1pBPAVJqoTbBx1ymKVo9X52H%2FN%2Fr%2BS0f%2Fv7kBN9cLpezQPe%2FNqQMMDMIxntdtxr8UZEBAVEp0%2B%2B%2FT2utVXKzDtnwUvzEgNMY2%2BztqOPOcKaPBNT3sEoYYE4%2BbbzVgtyt1kmWsOLU7GHY39h7qsnnYlup86F%2B1%2BW8%2FutrM9FYgiXp758bUk72I6Ub5ZLsWDqcd3SH6IFlzKb1OTnrQS3C6yKxmr8M2FfBNSvfxyXatvVSis79xPN0IXvBE9hmkVl5z1aG18FJ%2F%2BqmAw7vmzrgY6sgGALcBKzFJ2lDdZwlnhL9z%2FjL0WFIdqfBR6F9L%2B244RzZnk89L7k1h%2FtxUHmUmgxTLeC0NISeAlMDsXCkqbOwQqb%2BkPzZczs%2Fx5%2FNA%2B%2BoDfV632J%2FbrPvdmQwZMIbbY1HeFgElcvVo0o678Yt1ju3veOAV3UJKhfG%2B1qPkrUwN42hXhStRT9RCX14EYiOJkP6CiPa478%2FCsUNuFOY5o3Z2xzXgkd6zLqZi3dT%2BfTV9Pi6y3&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190936Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFCJEO2HVR%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d37323330c972645545ee5656cc95b295c634c957a0edb531d6c303dc8c8ca4d",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Pasta",
                "unit": "gram",
                "quantity": 80.0
            },
            {
                "name": "Pasta",
                "unit": "gram",
                "quantity": 80.0
            },
            {
                "name": "Mozzarella",
                "unit": "gram",
                "quantity": 100.0
            },
            {
                "name": "Extra Virgin Olive Oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Sage",
                "unit": "leaf",
                "quantity": 1.0
            },
            {
                "name": "herbs",
                "unit": "teaspoon",
                "quantity": 1.5
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Cinnamon Roll Waffles with Bacon-Apple Frosting Recipe",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/508/5080cd380725f6fe17a3a6dab67648f3.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=56ee5efd020aa2b1c26e121645969637df5733103f153f47020aa3ffc2f4415c",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "cinnamon rolls",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "bacon",
                "unit": "slice",
                "quantity": 6.0
            },
            {
                "name": "Granny Smith apple",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "dark brown sugar",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "bourbon",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "ground cinnamon",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "cream cheese",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "confectioners\u2019 sugar",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.125
            }
        ]
    },
    {
        "name": "Spring Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/fb6/fb65b5adae80e687ea941fd1fc29dd49.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=53ef9728e33a6f2372d3ea68d09773e06eca74a43817dc797c22e8f6cafa0ba5",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "sesame oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "ginger",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "ground chicken",
                "unit": "ounce",
                "quantity": 6.0
            },
            {
                "name": "onion",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "carrot",
                "unit": "carrot",
                "quantity": 1.0
            },
            {
                "name": "celery",
                "unit": "stalk",
                "quantity": 1.0
            },
            {
                "name": "shiitake mushrooms",
                "unit": "ounce",
                "quantity": 2.5
            },
            {
                "name": "napa cabbage",
                "unit": "ounce",
                "quantity": 10.0
            },
            {
                "name": "glass noodles",
                "unit": "ounce",
                "quantity": 2.5
            },
            {
                "name": "oyster sauce",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "sherry",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "cornstarch",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "soy sauce",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "white pepper",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "spring roll wrappers",
                "unit": "sheet",
                "quantity": 15.0
            },
            {
                "name": "water",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "flour",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "vegetable oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "water",
                "unit": "tablespoon",
                "quantity": 6.0
            },
            {
                "name": "rice vinegar",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "sugar",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "ketchup",
                "unit": "tablespoon",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Deli-Style Egg on a Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/320/320ea0a6842e74b116115bcb4fc1c26c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=69735151d91b3d0bb218c07f0d78387d060d1387f03de4c90099b44ba0132faa",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "soft roll",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "eggs",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "white Cheddar cheese",
                "unit": "slice",
                "quantity": 1.0
            },
            {
                "name": "bacon",
                "unit": "slice",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Shrimp Summer Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/08a/08a42938888a1c9902d5ab6d2717e5cd.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5a6d8a7a1669fa428148d0364bf7699718a5b6a31fae225f9f2bd06533a38e19",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "rice vermicelli noodles",
                "unit": "ounce",
                "quantity": 4.0
            },
            {
                "name": "roll",
                "unit": "pcs",
                "quantity": 12.0
            },
            {
                "name": "shrimp",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "Thai basil",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "napa cabbage",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "carrot",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 3.0
            },
            {
                "name": "jalapeno",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "palm sugar",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "limes",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "fish sauce",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "scallions",
                "unit": "pcs",
                "quantity": 2.0
            }
        ]
    },
    {
        "name": "Cinnamon Roll-Stuffed Pears",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/e81/e81b69fdd60256efa80493c1d9cecd01.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=50c3faad01af901353fcc22bcb0cb176707513a71d23b93e14cddeb9373c166c",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Bosc pears",
                "unit": "pcs",
                "quantity": 4.0
            },
            {
                "name": "dough",
                "unit": "ounce",
                "quantity": 12.0
            },
            {
                "name": "sugar",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "ground cinnamon",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "ground cloves",
                "unit": "teaspoon",
                "quantity": 0.125
            }
        ]
    },
    {
        "name": "Chocolate Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ee3/ee3f77f4e3f80ac79f297ca4fbc8d47b.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0bf4a61ed88dd92655629e8ceeb4d7bc9cb762700bfb9e6e9fe6d1528feeda9e",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg whites",
                "unit": "pcs",
                "quantity": 5.0
            },
            {
                "name": "confectioners' sugar",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "cocoa",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "egg yolks",
                "unit": "pcs",
                "quantity": 5.0
            },
            {
                "name": "heavy cream",
                "unit": "pint",
                "quantity": 0.5
            },
            {
                "name": "vanilla",
                "unit": "pint",
                "quantity": 0.5
            },
            {
                "name": "milk",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "confectioners' sugar",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "cocoa",
                "unit": "tablespoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "King Crab Dynamite Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/2ba/2ba055d8d2f08a318581bcce9a28ded2.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=367fac4420c401f29b07edcd8c7610c8431b720d5ba9ce49b401961673b61876",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "mayonnaise",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "fish roe",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "sesame oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "sesame oil",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "shoyu",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "crabmeat",
                "unit": "cup",
                "quantity": 1.5
            },
            {
                "name": "sesame seeds",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "prepared sushi rice",
                "unit": "cup",
                "quantity": 6.0
            },
            {
                "name": "nori",
                "unit": "pcs",
                "quantity": 7.0
            }
        ]
    },
    {
        "name": "Brooklyn Ricotta Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/0f5/0f5ce89d05da3077f429ba01bdfe9f5b.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=8cedf393ab412c5219c51b9302a1761b5d6ae458b762416f56fa474668647d5c",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "kaiser rolls",
                "unit": "roll",
                "quantity": 1.0
            },
            {
                "name": "mozzarella",
                "unit": "cup",
                "quantity": 0.6666666666666666
            },
            {
                "name": "ricotta",
                "unit": "cup",
                "quantity": 0.6666666666666666
            },
            {
                "name": "fresh basil",
                "unit": "leaf",
                "quantity": 6.0
            }
        ]
    },
    {
        "name": "Egg Roll Recipe",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b33/b33bb8897f6e761a843fd6cadf51ee03.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=5d1efae30e517d8186119ce55655e3c73e947a16400894e4ebf48a5efd5e3b50",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "ground pork",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "soy sauce",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "oyster sauce",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "rice vinegar",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "cornstarch",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 3.0
            },
            {
                "name": "fresh ginger",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "vegetable oil",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "napa cabbage",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "carrot",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "egg roll wrappers",
                "unit": "package",
                "quantity": 1.0
            },
            {
                "name": "peanut oil",
                "unit": "cup",
                "quantity": 3.5
            }
        ]
    },
    {
        "name": "Easy Cheesy Pizza Roll-Ups",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/eb7/eb72cd66a3577c3e96e05f63c1b9ba51.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=89361a45d4f489b0f895b4d1a99eb5020946a02a8bc5843da9d1fc8819a565e3",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "pizza sauce",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "pepperoni",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "mozzarella cheese",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "Parmigiano-Reggiano",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "wraps",
                "unit": "pcs",
                "quantity": 12.0
            },
            {
                "name": "Olive oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Snickers Egg Rolls",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/90f/90fc2888bcf1f6116b4e035c010f952b.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=92e6e6d40076329a97c7454f98cafd1bb2accf06ba0cf7abcbc86dff6607cbaa",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "egg roll wrappers",
                "unit": "pcs",
                "quantity": 12.0
            },
            {
                "name": "Snickers bars",
                "unit": "pcs",
                "quantity": 12.0
            },
            {
                "name": "granulated sugar",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "semisweet chocolate chips",
                "unit": "cup",
                "quantity": 0.5
            }
        ]
    },
    {
        "name": "Cinnamon Rolls",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/963/963025f5a90b7a5911b408c71a620c60.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d94142ae2fde834b3561bfe48aabc941d8d232bdb25a7dcc41e6358262e6c7ca",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Dough",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 10.0
            },
            {
                "name": "Sugar",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "Cinnamon",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "powdered sugar",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Make This Wicked Healthy Lobster Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/87b/87b7d1f57221c4b13ada55ca26b0974c.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ceee13bca1acd6dca3e8d8977ebf121d0831f68d8898d3a1b9171686ab3c6016",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "lobster",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Lemon",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "olive oil",
                "unit": "tablespoon",
                "quantity": 3.0
            },
            {
                "name": "lemon",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "rice wine",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "dijon mustard",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "chives",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "shallot",
                "unit": "teaspoon",
                "quantity": 2.0
            },
            {
                "name": "paprika",
                "unit": "pinch",
                "quantity": 1.0
            },
            {
                "name": "potato roll",
                "unit": "piece",
                "quantity": 4.0
            }
        ]
    },
    {
        "name": "Meatball Sub Egg Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/065/065b6a3da6965c1caa0c0d8905ceabf0.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=edb78491bd81c020f5f1d150978e9424c837001801e9d1d3b28bfdb03e660778",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "meatballs",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "marinara sauce",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "egg roll wrappers",
                "unit": "square",
                "quantity": 8.0
            },
            {
                "name": "eggs",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "mozzarella",
                "unit": "ounce",
                "quantity": 8.0
            },
            {
                "name": "fresh basil",
                "unit": "leaf",
                "quantity": 16.0
            },
            {
                "name": "Peanut oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Banana Spring Rolls",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/d42/d42b5d72572a4d5f9ff02ae27b8604de.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=35da4f7efc3525b024240a21869ec910bc7753f3373a03bcdabcfb810e022b31",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "bananas",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "spring roll wrappers",
                "unit": "pcs",
                "quantity": 8.0
            },
            {
                "name": "brown sugar",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "Oil",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Apple Pie Egg Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/b63/b6387a9a834d84edf804ad31d63ae84f.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=7bb852b5c2fbe20a01c714e10b1cfdb6a7a2ace847513d6057eead30d3c2ac54",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 8.0
            },
            {
                "name": "Granny Smith apples",
                "unit": "pcs",
                "quantity": 3.0
            },
            {
                "name": "vanilla bean",
                "unit": "pcs",
                "quantity": 0.5
            },
            {
                "name": "sugar",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "ground cinnamon",
                "unit": "teaspoon",
                "quantity": 0.5
            },
            {
                "name": "salt",
                "unit": "pinch",
                "quantity": 1.0
            },
            {
                "name": "all-purpose flour",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "lemon juice",
                "unit": "lemon",
                "quantity": 0.5
            },
            {
                "name": "egg roll wrappers",
                "unit": "square",
                "quantity": 8.0
            },
            {
                "name": "eggs",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Peanut oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Powdered sugar",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Best Dressed Roll - Tuxedo Roll",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/1b4/1b433fa7fe93e54700f76afb26a2d6dd.jpg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=a3cf5a78cb5b63ad68b633de8fe76cec937e77725613611e7a17fc2b29843e50",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "mayonnaise",
                "unit": "cup",
                "quantity": 0.25
            },
            {
                "name": "kimchi",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "sriracha sauce",
                "unit": "teaspoon",
                "quantity": 0.25
            },
            {
                "name": "lemon juice",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "powdered sugar",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "cabbage",
                "unit": "cup",
                "quantity": 2.0
            },
            {
                "name": "mayonnaise",
                "unit": "cup",
                "quantity": 0.5
            },
            {
                "name": "lemon juice",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "sriracha sauce",
                "unit": "teaspoon",
                "quantity": 1.0
            },
            {
                "name": "lobster meat",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "celery",
                "unit": "stalk",
                "quantity": 1.0
            },
            {
                "name": "green onion",
                "unit": "tablespoon",
                "quantity": 2.0
            },
            {
                "name": "Salt",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Old Bay seasoning",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Dinner Rolls",
                "unit": "",
                "quantity": ""
            }
        ]
    },
    {
        "name": "Pepperoni Pizza Roll-Ups with Whipped Garlic Butter Dipping Sauce",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/09e/09ec7af890d4f3ca0358e639a98d44a2.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=d32b9e759cddb72cca53113e1e6b5d7dbe6774b74850e8230c0fcfc30229e87e",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Roll",
                "unit": "ounce",
                "quantity": 19.200000762939453
            },
            {
                "name": "garlic",
                "unit": "clove",
                "quantity": 4.0
            },
            {
                "name": "butter",
                "unit": "tablespoon",
                "quantity": 12.0
            },
            {
                "name": "parsley",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "salt",
                "unit": "teaspoon",
                "quantity": 1.0
            }
        ]
    },
    {
        "name": "Pork Egg Roll with Broccoli Slaw",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/ae0/ae019c81a0bd932097b79e59997fafc0.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=0633c23b2c6b8f37697b63513402dc3f298ced79aaffb61ad43c5d0d3313f88e",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "Peanut oil",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "sesame oil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "ground pork",
                "unit": "pound",
                "quantity": 1.0
            },
            {
                "name": "garlic",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "five-spice powder",
                "unit": "pinch",
                "quantity": 1.0
            },
            {
                "name": "black pepper",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Thai Basil",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "lime",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "broccoli",
                "unit": "pcs",
                "quantity": 1.0
            },
            {
                "name": "egg roll wrappers",
                "unit": "pcs",
                "quantity": 6.0
            },
            {
                "name": "egg whites",
                "unit": "pcs",
                "quantity": 2.0
            },
            {
                "name": "Mushroom",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "stock",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "hoisin sauce",
                "unit": "tablespoon",
                "quantity": 1.0
            },
            {
                "name": "scallions",
                "unit": "tablespoon",
                "quantity": 3.0
            }
        ]
    },
    {
        "name": "Cinnamon Roll Stickies",
        "imageUrl": "https://edamam-product-images.s3.amazonaws.com/web-img/13a/13ab74f13d89be9fe0109b72f36b392a.jpeg?X-Amz-Security-Token=IQoJb3JpZ2luX2VjELr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIFiKD7DBdQ4T9WCt3hUP8FHpn71aYIEbUiZbcIjXqvH1AiEAmHi1jfLXXiEG%2FzGEbRzUxKo4mRW3y14czKD49O64ihcqwgUIk%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgwxODcwMTcxNTA5ODYiDM39i1C9crSQN4OkKSqWBYOiiWTFEqwhP1l%2BzNc4wEzHg3qGKh%2FOCGQrTuZ6E8fMRV23JNj58c%2F3kqjQuDeoA8gAtOUqJ1LNEyy6LVhQrZq11jpsRWxFrELgaMz6s9c29E30HYIVxbq73uG1WkycZNh0TMRyyN4Pt4cl%2FcBG0Ii2Ybs9Cc8p4PNO3ZHXgyS%2F9WQHIt%2FSdwDbgT1%2FWXW%2BKX6t4WoIiJDJ7jznjLr7X8HWHbLDInrTkDILW1YPiiwzrLsGOMS9VwU206Ppo9788TDozPw9K2q%2BG3L8AclOu3FI0RzYNI0aGvnihlt6lNu8alhCiG8nmE8trliE0c94RfQGYt8kKBJt%2FjC5vgY6RmvdlheYDKR0JpK3qc52H9DV6rP%2BxS%2BRg2Yk3yUBrYv28HTajIHjDcLuniicIgVzQ0ErGAOElzsCOTTPiVkG3ZYOUfSH2t6rUlONI4VBxL8tR58aSvT%2B4Eh5LJAWEZpxcDTC6uCmsBqMu59rFoAeQp3ZXgQ5RbhmEEglKWjlFtCElJD%2BAiGkZkxjtxr%2BIRYNa7a4tPhtDClpEBM2h%2BDzAZ6lpwutCwBieWe0UPpJnjnH9JrRbxVaYUBvsm2oEJIOByrY9eIuMKyhbeYucYTIm%2BMF8Hi9qAGXyjUKiEPbhdQ7qgLpf40vOwURAlB3dUQ905oMXy1Wv%2B%2FsFrmA%2FpzNfqsuxJRhTIfh9HSuN02mmUxUbxcLByHu9ZPieLK7nY6mfBSrOH9sph1RvQ6Szbi8D%2FCsb7VpltzVBKt4oI3xv360Xd9kxyFtgktcbDAzX9FvfQenFbESJe7gWefeNnPnoiOXm1f73vkkGOIhPz1mJZFukO5zHqln3S1JDJuop8U7pBYLGQDNFIUea%2FC%2Fuu8XGw8NsJvvbkAsMNHvs64GOrEBNQpfSvEhXtBys%2FvY9MX3G6Hc%2Bj4S7TwpsspIzVu8lYncNgWAoveuDxBokrrJlVs21dooCn4XXntaeddY45scZiIVEck5SVmWYNjMYTAVRd3iGmRAkDFg2%2BmvA8WKB6f7Wjth5xRc9SgK5opfdzDyEZmSP29wQ1fWrOMwcgFKrs%2F4UtqL%2FqOBoG%2BO0yWuMIezM%2FGbU56tOSpyI8OZr6dNo6csFcJGmdEJimq3haxR3zXm&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240214T190937Z&X-Amz-SignedHeaders=host&X-Amz-Expires=3600&X-Amz-Credential=ASIASXCYXIIFO52X76J5%2F20240214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=774f12fd93915e9d97da233df34772507ad7852b0efb529a028560b831deb066",
        "category": "lunch/dinner",
        "ingredients": [
            {
                "name": "dark brown sugar",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "maple syrup",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 8.0
            },
            {
                "name": "cinnamon rolls with frosting",
                "unit": "ounce",
                "quantity": 12.399999618530273
            },
            {
                "name": "All-purpose flour",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Vanilla ice cream",
                "unit": "serving",
                "quantity": 1.0
            },
            {
                "name": "dark brown sugar",
                "unit": "cup",
                "quantity": 1.0
            },
            {
                "name": "maple syrup",
                "unit": "cup",
                "quantity": 0.3333333333333333
            },
            {
                "name": "unsalted butter",
                "unit": "tablespoon",
                "quantity": 8.0
            },
            {
                "name": "cinnamon rolls with frosting",
                "unit": "ounce",
                "quantity": 12.399999618530273
            },
            {
                "name": "All-purpose flour",
                "unit": "",
                "quantity": ""
            },
            {
                "name": "Vanilla ice cream",
                "unit": "serving",
                "quantity": 1.0
            }
        ]
    }
]