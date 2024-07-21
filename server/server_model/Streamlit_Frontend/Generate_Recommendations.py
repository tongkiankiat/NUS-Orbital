import requests
import json
from flask import Flask, request, jsonify
from random import uniform as rnd
import traceback

app = Flask(__name__)

class Generator:
    def __init__(self,nutrition_input:list,ingredients:list=[],params:dict={'n_neighbors':5,'return_distance':False}):
        self.nutrition_input=nutrition_input
        self.ingredients=ingredients
        self.params=params

    def set_request(self,nutrition_input:list,ingredients:list,params:dict):
        self.nutrition_input=nutrition_input
        self.ingredients=ingredients
        self.params=params

    def generate(self,):
        request={
            'nutrition_input':self.nutrition_input,
            'ingredients':self.ingredients,
            'params':self.params
        }
        response=requests.post(url='http://backend:8080/predict/',data=json.dumps(request))
        return response

@app.route('/generate_recommendations', methods=['GET'])
def generate_recommendations():
        params = request.args.to_dict()
        print('Params: ', params, flush=True)
        params['weight_change'] = float(params['weight_change'])
        params['weight'] = float(params['weight'])
        params['height'] = float(params['height'])
        params['age'] = int(params['age'])
        meals_calories_perc = {
            'breakfast': float(params['breakfast']),
            'lunch': float(params['lunch']),
            'dinner': float(params['dinner']),
            'snacks': float(params['snacks'])
        }
        params['meals_calories_perc'] = meals_calories_perc
        params['allergies'] = params.get('allergies', [])
        total_calories=params['weight_change'] * calories_calculator(params)
        recommendations=[]  
        for meal in params['meals_calories_perc']:
            meal_calories=params['meals_calories_perc'][meal] * total_calories
            if meal=='breakfast':        
                recommended_nutrition = [meal_calories,rnd(10,30),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,10),rnd(0,10),rnd(30,100)]
            elif meal=='launch':
                recommended_nutrition = [meal_calories,rnd(20,40),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,20),rnd(0,10),rnd(50,175)]
            elif meal=='dinner':
                recommended_nutrition = [meal_calories,rnd(20,40),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,20),rnd(0,10),rnd(50,175)] 
            else:
                recommended_nutrition = [meal_calories,rnd(10,30),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,10),rnd(0,10),rnd(30,100)]
            generator=Generator(recommended_nutrition)

            filtered_recipes = []
            try: 
              while len(filtered_recipes) < 5:
                recommended_recipes = generator.generate().json()['output']
                filtered_recipes.extend(filter_allergies(params['allergies'], recommended_recipes))
                filtered_recipes = filtered_recipes[:5]

              recommendations.append(filtered_recipes)
            except:
              traceback.print_exc()
              return

        return jsonify(recommendations)

def calories_calculator(params):
        activites=['Sedentary (Little to no exercise)', 'Lightly Active (Exercise/Sports 1-3 days per week)', 'Moderately Active (Exercise/Sports 3-5 days per week or more)']
        weights=[1.2,1.375,1.55]
        weight = weights[activites.index(params['activity'])]
        maintain_calories = calculate_bmr(params)*weight
        return maintain_calories

def calculate_bmr(params):
        if params['gender']=='Male':
            bmr=10*params['weight']+6.25*params['height']-5*params['age']+5
        else:
            bmr=10*params['weight']+6.25*params['height']-5*params['age']-161
        return bmr

@app.route('/filter_fatsecret', methods=['POST'])
def fatsecret_filter():
    data = request.get_json()
    print('Data: ', data, flush=True)
    try: 
      response = requests.post('http://192.168.1.141:3000/api/proxy', json=data)
      if response.status_code == 200:
          data = response.json()
          return jsonify({'safe': True})
      return jsonify({'safe': False})
    except:
      traceback.print_exc()
      return False

def filter_allergies(allergies, recommended_recipes):
    filtered_recipes = []
    for recipe in recommended_recipes:
        if not any(allergy in recipe['RecipeIngredientParts'] for allergy in allergies):
            print('Food Name: ', recipe['Name'], flush=True)
            response = requests.post('http://192.168.1.141:5000/filter_fatsecret', json={'item': recipe['Name']})
            if response.json().get('safe'):
              filtered_recipes.append(recipe)
            elif response == False:
              return False
    return filtered_recipes

if __name__ == '__main__':
     app.run(host='0.0.0.0', port=5000, debug=True)