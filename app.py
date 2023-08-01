import pandas as pd
from flask import Flask, jsonify, request

app = Flask(__name__)

def add_expense(expenses_df, date, category, description, amount):
    new_row = {'Date': pd.to_datetime(date, format='%d-%m-%Y'), 'Category': category, 'Description': description, 'Amount': amount}
    expenses_df = expenses_df.append(new_row, ignore_index=True)
    return expenses_df

def save_expenses_to_csv(expenses_df, filename):
    expenses_df.to_csv(filename, index=False)

# Load expenses from the CSV file (if exists)
filename = "daily_expenses.csv"
try:
    expenses_df = pd.read_csv(filename, parse_dates=['Date'], dayfirst=True)
except FileNotFoundError:
    columns = ['Date', 'Category', 'Description', 'Amount']
    expenses_df = pd.DataFrame(columns=columns)

@app.route('/add_expense', methods=['POST'])
def add_expense_route():
    data = request.get_json()
    date = data['date']
    category = data['category']
    description = data['description']
    amount = data['amount']
    global expenses_df
    expenses_df = add_expense(expenses_df, date, category, description, amount)
    save_expenses_to_csv(expenses_df, filename)
    return jsonify(success=True)

@app.route('/get_expenses', methods=['GET'])
def get_expenses_route():
    return jsonify(expenses_df.to_dict('records'))

if __name__ == "__main__":
    app.run(debug=True)
