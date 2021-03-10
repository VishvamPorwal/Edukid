import requests
import json
import os

def pic_of_day():
    url = f"https://api.nasa.gov/planetary/apod?api_key={os.getenv('apod_api_key')}"
	
    response = requests.request("GET", url)
    response = json.loads(response.text)
    try:
    	image = response["hdurl"]
    except:
    	image = response["url"]
    return image
