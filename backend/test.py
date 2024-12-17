import google.generativeai as genai


genai.configure(api_key="AIzaSyDB6CS9UJYhPmTF7y6_R9Nu3Dz6r2Yua9o")
model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content("Explain how AI works")
print(response.text)
