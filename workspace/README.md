# COVID-19 Data Analysis and Prediction

This project provides a comprehensive analysis of COVID-19 data and includes a machine learning model to predict deaths based on confirmed, recovered, and active cases.

## Overview

This project includes:
1. Exploratory data analysis of COVID-19 data
2. Time series visualization and forecasting
3. Machine learning model for death prediction
4. Interactive web application for data exploration and prediction

## Dataset

The dataset used in this project contains COVID-19 data from January 22, 2020, to July 27, 2020, with the following columns:
- Province/State
- Country/Region
- Latitude and Longitude
- Date
- Confirmed cases
- Deaths
- Recovered cases
- Active cases
- WHO Region

## Project Structure

```
.
├── covid_19_clean_complete.csv       # Original dataset
├── covid19_deaths_prediction_model.pkl  # Trained ML model
├── covid19_prediction_app.py         # Streamlit web application
├── covid19_prediction_function.py    # Function for making predictions
├── global_cases_time_series.png      # Visualization of global cases over time
├── cases_by_who_region.png           # Visualization of cases by WHO region
├── confirmed_cases_distribution.png  # Distribution of confirmed cases
├── top10_countries_confirmed.png     # Top 10 countries by confirmed cases
├── top10_countries_mortality.png     # Top 10 countries by mortality rate
├── correlation_heatmap.png           # Correlation between COVID-19 metrics
├── global_forecast.png               # Forecast of global confirmed cases
├── forecast_components.png           # Components of the forecast
├── top5_countries_forecast.png       # Forecast for top 5 countries
├── global_growth_rate.png            # Growth rate of global cases
├── global_doubling_time.png          # Doubling time of global cases
├── actual_vs_predicted_deaths.png    # Actual vs predicted deaths
└── README.md                         # Project documentation
```

## Key Findings

### Global Statistics (as of July 27, 2020)
- Total Confirmed Cases: 16,249,165
- Total Deaths: 649,208
- Total Recovered: 9,371,551
- Total Active Cases: 6,228,406

### Regional Analysis
- Americas has the highest number of confirmed cases, followed by Europe
- Europe has the highest mortality rate (7.74%), followed by Americas (4.81%)
- Africa has the lowest mortality rate (2.02%)

### Top Countries
- US has the highest number of confirmed cases (4,290,259), followed by Brazil (2,442,375) and India (1,480,073)
- Mexico has the highest mortality rate among top 10 countries (11.13%), followed by UK (15.25%)

### Time Series Analysis
- The global growth rate of confirmed cases has been decreasing over time
- The doubling time of global confirmed cases has been increasing

### Prediction Model
- Linear Regression model achieved the highest R² score (1.0) for predicting deaths
- The most important features for prediction are confirmed cases, followed by recovered and active cases

## How to Use

### Web Application

The Streamlit web application provides an interactive interface for exploring the data and making predictions:

1. **Dashboard**: View global statistics, time series trends, and regional analysis
2. **Predictions**: Enter confirmed, recovered, and active cases to predict deaths
3. **About**: Information about the application and model

To run the application:
```bash
streamlit run covid19_prediction_app.py
```

### Prediction Function

You can also use the prediction function directly in your code:

```python
from covid19_prediction_function import predict_deaths

# Example usage
confirmed = 100000
recovered = 50000
active = 45000
predicted_deaths = predict_deaths(confirmed, recovered, active)
print(f"Predicted deaths: {predicted_deaths:.0f}")
```

## Model Information

- **Model Type**: Linear Regression
- **Features**: Confirmed cases, Recovered cases, Active cases
- **Target**: Deaths
- **Performance**: R² = 1.0, RMSE = 2.47e-11, MAE = 1.33e-11

## Limitations

- The dataset only covers the early phase of the pandemic (January to July 2020)
- The model does not account for new variants or changes in healthcare responses
- Predictions are based on historical data and should be used with caution

## Future Work

- Update the dataset with more recent data
- Incorporate additional features such as vaccination rates, hospital capacity, etc.
- Develop more sophisticated models (e.g., LSTM, Prophet) for time series forecasting
- Create a more comprehensive dashboard with additional visualizations and insights

## Requirements

- Python 3.6+
- pandas
- numpy
- matplotlib
- seaborn
- scikit-learn
- prophet
- streamlit
- joblib

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Dataset source: COVID-19 clean complete dataset
- Thanks to all healthcare workers fighting against COVID-19