from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "success",
        "service": "NexBiz AI Analytics Engine",
        "health": "excellent"
    }), 200

@app.route('/api/analytics/invoice-risk', methods=['POST'])
def invoice_risk():
    data = request.get_json() or {}
    invoice_id = data.get('invoice_id', 'unknown')
    amount = float(data.get('amount', 0.0))
    days_overdue = int(data.get('days_overdue', 0))
    
    # Simple predictive risk score heuristic (0 to 100)
    risk_score = min(100.0, max(0.0, (days_overdue * 2.5) + (amount / 2000.0)))
    
    if risk_score > 70:
        risk_level = "high"
        recommendation = "Escalate account; immediate suspension of credit terms recommended."
    elif risk_score > 35:
        risk_level = "medium"
        recommendation = "Send automated reminder email and schedule employee follow-up."
    else:
        risk_level = "low"
        recommendation = "Standard billing terms; no action required."
        
    return jsonify({
        "invoice_id": invoice_id,
        "risk_score": round(risk_score, 2),
        "risk_level": risk_level,
        "recommendation": recommendation
    }), 200

@app.route('/api/analytics/sales-forecast', methods=['GET'])
def sales_forecast():
    # Placeholder return for future monthly sales trend predictions
    return jsonify({
        "forecast_period": "Next 3 Months",
        "predictions": [
            {"month": "Month 1", "estimated_sales": 15400.00, "confidence_lower": 14200.00, "confidence_upper": 16600.00},
            {"month": "Month 2", "estimated_sales": 16900.00, "confidence_lower": 15400.00, "confidence_upper": 18400.00},
            {"month": "Month 3", "estimated_sales": 18500.00, "confidence_lower": 16800.00, "confidence_upper": 20200.00}
        ],
        "algorithm": "Linear Regression Baseline Model"
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
