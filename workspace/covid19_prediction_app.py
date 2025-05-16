import streamlit as st
import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta

# Load the model
@st.cache_resource
def load_model():
    return joblib.load('covid19_deaths_prediction_model.pkl')

# Load the dataset
@st.cache_data
def load_data():
    df = pd.read_csv('/workspace/uploads/covid_19_clean_complete.csv')
    df['Date'] = pd.to_datetime(df['Date'])
    return df

# Function to predict deaths
def predict_deaths(confirmed, recovered, active):
    model = load_model()
    prediction = model.predict([[confirmed, recovered, active]])[0]
    return prediction

# Main function
def main():
    st.title('COVID-19 Data Analysis and Prediction')
    
    # Sidebar
    st.sidebar.title('Navigation')
    page = st.sidebar.radio('Go to', ['Dashboard', 'Predictions', 'About'])
    
    # Load data
    df = load_data()
    
    if page == 'Dashboard':
        st.header('COVID-19 Dashboard')
        
        # Global statistics
        st.subheader('Global Statistics')
        latest_date = df['Date'].max()
        latest_data = df[df['Date'] == latest_date]
        
        global_confirmed = latest_data['Confirmed'].sum()
        global_deaths = latest_data['Deaths'].sum()
        global_recovered = latest_data['Recovered'].sum()
        global_active = latest_data['Active'].sum()
        
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Confirmed", f"{global_confirmed:,}")
        col2.metric("Deaths", f"{global_deaths:,}")
        col3.metric("Recovered", f"{global_recovered:,}")
        col4.metric("Active", f"{global_active:,}")
        
        # Time series data
        st.subheader('Global Trends')
        global_time_series = df.groupby('Date')[['Confirmed', 'Deaths', 'Recovered', 'Active']].sum()
        
        # Plot options
        plot_type = st.selectbox('Select Plot Type', ['All Metrics', 'Confirmed Cases', 'Deaths', 'Recovered', 'Active Cases'])
        
        fig, ax = plt.subplots(figsize=(10, 6))
        
        if plot_type == 'All Metrics':
            ax.plot(global_time_series.index, global_time_series['Confirmed'], label='Confirmed')
            ax.plot(global_time_series.index, global_time_series['Deaths'], label='Deaths')
            ax.plot(global_time_series.index, global_time_series['Recovered'], label='Recovered')
            ax.plot(global_time_series.index, global_time_series['Active'], label='Active')
        elif plot_type == 'Confirmed Cases':
            ax.plot(global_time_series.index, global_time_series['Confirmed'], label='Confirmed')
        elif plot_type == 'Deaths':
            ax.plot(global_time_series.index, global_time_series['Deaths'], label='Deaths')
        elif plot_type == 'Recovered':
            ax.plot(global_time_series.index, global_time_series['Recovered'], label='Recovered')
        elif plot_type == 'Active Cases':
            ax.plot(global_time_series.index, global_time_series['Active'], label='Active')
            
        ax.set_title(f'Global COVID-19 {plot_type} Over Time')
        ax.set_xlabel('Date')
        ax.set_ylabel('Number of Cases')
        ax.legend()
        ax.grid(True)
        st.pyplot(fig)
        
        # Regional data
        st.subheader('Regional Statistics')
        region_data = df.groupby('WHO Region')[['Confirmed', 'Deaths', 'Recovered', 'Active']].sum().reset_index()
        region_data['Mortality Rate (%)'] = (region_data['Deaths'] / region_data['Confirmed']) * 100
        
        st.dataframe(region_data.sort_values('Confirmed', ascending=False))
        
        # Regional visualization
        st.subheader('Regional Visualization')
        region_metric = st.selectbox('Select Metric', ['Confirmed', 'Deaths', 'Recovered', 'Active', 'Mortality Rate (%)'])
        
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.barplot(x='WHO Region', y=region_metric, data=region_data.sort_values(region_metric, ascending=False))
        ax.set_title(f'{region_metric} by WHO Region')
        ax.set_xlabel('WHO Region')
        ax.set_ylabel(region_metric)
        plt.xticks(rotation=45)
        st.pyplot(fig)
        
        # Top countries
        st.subheader('Top 10 Countries')
        top_metric = st.selectbox('Select Metric for Top Countries', ['Confirmed', 'Deaths', 'Recovered', 'Active', 'Mortality Rate'])
        
        if top_metric == 'Mortality Rate':
            latest_data['Mortality Rate'] = (latest_data['Deaths'] / latest_data['Confirmed']) * 100
            top_countries = latest_data.sort_values('Mortality Rate', ascending=False).head(10)
            metric_col = 'Mortality Rate'
        else:
            top_countries = latest_data.sort_values(top_metric, ascending=False).head(10)
            metric_col = top_metric
        
        fig, ax = plt.subplots(figsize=(10, 6))
        sns.barplot(x='Country/Region', y=metric_col, data=top_countries)
        ax.set_title(f'Top 10 Countries by {top_metric}')
        ax.set_xlabel('Country/Region')
        ax.set_ylabel(top_metric)
        plt.xticks(rotation=45)
        st.pyplot(fig)
        
    elif page == 'Predictions':
        st.header('COVID-19 Death Prediction')
        st.write('This model predicts the number of deaths based on confirmed, recovered, and active cases.')
        
        # Input form
        st.subheader('Enter Case Information')
        confirmed = st.number_input('Confirmed Cases', min_value=0, value=100000)
        recovered = st.number_input('Recovered Cases', min_value=0, value=50000)
        active = st.number_input('Active Cases', min_value=0, value=45000)
        
        if st.button('Predict'):
            prediction = predict_deaths(confirmed, recovered, active)
            st.success(f'Predicted Deaths: {prediction:.0f}')
            
            # Show mortality rate
            mortality_rate = (prediction / confirmed) * 100 if confirmed > 0 else 0
            st.info(f'Predicted Mortality Rate: {mortality_rate:.2f}%')
            
            # Compare with global average
            latest_date = df['Date'].max()
            latest_data = df[df['Date'] == latest_date]
            global_mortality = (latest_data['Deaths'].sum() / latest_data['Confirmed'].sum()) * 100
            
            if mortality_rate > global_mortality:
                st.warning(f'The predicted mortality rate is higher than the global average of {global_mortality:.2f}%')
            else:
                st.success(f'The predicted mortality rate is lower than the global average of {global_mortality:.2f}%')
        
        # Country comparison
        st.subheader('Compare with Existing Countries')
        latest_date = df['Date'].max()
        latest_data = df[df['Date'] == latest_date]
        
        # Find countries with similar confirmed cases
        similar_countries = latest_data[
            (latest_data['Confirmed'] >= confirmed * 0.8) & 
            (latest_data['Confirmed'] <= confirmed * 1.2)
        ].sort_values('Confirmed')
        
        if not similar_countries.empty:
            st.write(f'Countries with similar confirmed cases ({confirmed * 0.8:.0f} - {confirmed * 1.2:.0f}):')
            
            # Display similar countries
            similar_countries['Mortality Rate (%)'] = (similar_countries['Deaths'] / similar_countries['Confirmed']) * 100
            st.dataframe(similar_countries[['Country/Region', 'Confirmed', 'Deaths', 'Recovered', 'Active', 'Mortality Rate (%)']])
        else:
            st.write('No countries found with similar confirmed cases.')
            
    else:  # About page
        st.header('About this Application')
        st.write("""
        ## COVID-19 Data Analysis and Prediction Tool
        
        This application provides analysis and predictions based on the COVID-19 dataset.
        
        ### Features:
        - Dashboard with global and regional statistics
        - Time series visualization of COVID-19 metrics
        - Regional and country-level analysis
        - Machine learning model to predict deaths based on case information
        
        ### Data Source:
        The dataset used in this application contains COVID-19 data from January 22, 2020 to July 27, 2020.
        
        ### Model Information:
        The prediction model is a Linear Regression model trained on country-level data.
        Features used for prediction:
        - Confirmed cases
        - Recovered cases
        - Active cases
        
        ### Limitations:
        - The model is based on historical data and may not account for new variants or changes in healthcare responses
        - Predictions are estimates and should be used with caution
        - The dataset only covers the early phase of the pandemic
        """)

if __name__ == '__main__':
    main()