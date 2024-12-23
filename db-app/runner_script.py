import requests
import random

import time
 
# api-endpoint

def main(port):
    urls = [
        {
            "method": "POST",
            "url": "http://localhost:" + port + "/api/v1/user/register",
            "body": {
                "name": "jojo",
                "email": "def@def.com",
                "password": "43dfdf123"
            }
        },
        { 
            "method": "GET",
            "url": "http://localhost:" + port + "/api/v1/tweet/getTweets",
            "body": {
                "author": "jojo"
            }
        },
        {
            "method": "GET",
            "url": "http://localhost:" + port + "/api/v1/tweet/getTweets",
            "body": {
                "author": "lsiewpen"
            }        
        },
        {
            "method": "POST",
            "url": "http://localhost:" + port + "/api/v1/tweet/postTweet",
            "body": {
                "author": "somna",
                "message": "fgdsfdsfs"
            }
        },
        {
            "method": "POST",
            "url": "http://localhost:" + port + "/api/v1/user/login",
            "body": {
                "name": "jojo",
                "email": "def@def.com",
                "password": "43dfdf123"
            }
        },
        {
            "method": "POST",
            "url": "http://localhost:" + port + "/api/v1/user/register",
            "body": {
                "name": "jojo",
                "email": "def@def.com",
                "password": "43dfdf123"
            }
        } 
    ]
    while True:
        j = random.randrange(len(urls))

        url_details = urls[j]

        print("url to call: {}".format(url_details["url"]))

        if url_details["method"] == "POST":
            if url_details["url"] == "http://localhost:" + port + "auth/register":
                url_details["body"]["name"] = url_details["body"]["name"] +"_"+ str(j+20)
                url_details["body"]["email"] = "def_" + str(j+20) + "abc.com"
            r = requests.post(url=url_details["url"], data=url_details["body"])
        else:
            r = requests.get(url=url_details["url"], params=url_details["body"])

        time.sleep(random.randrange(6))

if __name__ == "__main__":
    port = input("Port to use: ")
    main(port)