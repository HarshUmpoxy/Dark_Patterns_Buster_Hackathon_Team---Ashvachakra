from flask import Flask, jsonify, request
from flask_cors import CORS
from joblib import load

clf = load('dark_pattern_classifier.joblib')
vectorizer = load('dark_pattern_vectorizer.joblib')
label_encoder = load('dark_pattern_label_encoder.joblib')

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['POST'])
def main():
    if request.method == 'POST':
        output = []
        data = request.get_json().get('tokens')

        for token in data:
            
            # Vectorize the tokenized text
            vectorized_text = vectorizer.transform([' '.join(token)])
            # Make the prediction
            predicted_label = clf.predict(vectorized_text)
            # Convert the predicted label back to the original category
            predicted_category = label_encoder.inverse_transform(predicted_label)

            output.append(predicted_category)

        # dark = [data[i] for i in range(len(output)) if output[i] != 'Not Dark Pattern']
        # for d in dark:
        #     print(d)
        # print()
        # print(len(dark))

        message = '{ \'result\': ' + str(output) + ' }'
        print(message)

        json = jsonify(message)

        return json

if __name__ == '__main__':
    app.run(threaded=True, debug=True)
