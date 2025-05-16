---
name: ml_libraries
agent: AIAgent
triggers:
- machine learning
- ml
- data science
- pandas
- scikit-learn
- sklearn
- tensorflow
- pytorch
- keras
- deep learning
---

# Machine Learning Libraries Guide

## Core Libraries

### Data Manipulation and Analysis
- **pandas**: Essential for data manipulation and analysis
  - Installation: `pip install pandas`
  - Import: `import pandas as pd`
  - Key functions: `read_csv()`, `DataFrame()`, `describe()`, `groupby()`

### Numerical Computing
- **NumPy**: Fundamental package for scientific computing
  - Installation: `pip install numpy`
  - Import: `import numpy as np`
  - Key functions: `array()`, `mean()`, `std()`, `random.rand()`

### Visualization
- **Matplotlib**: Basic plotting library
  - Installation: `pip install matplotlib`
  - Import: `import matplotlib.pyplot as plt`
  - Key functions: `plot()`, `scatter()`, `hist()`, `savefig()`

- **Seaborn**: Statistical data visualization
  - Installation: `pip install seaborn`
  - Import: `import seaborn as sns`
  - Key functions: `heatmap()`, `pairplot()`, `barplot()`, `countplot()`

### Machine Learning
- **scikit-learn**: Machine learning algorithms and tools
  - Installation: `pip install scikit-learn`
  - Import: `from sklearn import [module]`
  - Key modules:
    - `preprocessing`: Data preprocessing tools
    - `model_selection`: Train/test splitting, cross-validation
    - `metrics`: Performance evaluation
    - `linear_model`, `tree`, `ensemble`, `svm`: ML algorithms

## Deep Learning Libraries

### TensorFlow/Keras
- **TensorFlow**: Deep learning framework
  - Installation: `pip install tensorflow`
  - Import: `import tensorflow as tf`

- **Keras**: High-level neural networks API
  - Installation: Included with TensorFlow
  - Import: `from tensorflow import keras`
  - Key components: `Sequential`, `Dense`, `Conv2D`, `LSTM`

### PyTorch
- **PyTorch**: Deep learning framework
  - Installation: `pip install torch torchvision`
  - Import: `import torch`
  - Key components: `nn.Module`, `DataLoader`, `optim`

## Specialized Libraries

### Natural Language Processing
- **NLTK**: Natural Language Toolkit
  - Installation: `pip install nltk`
  - Import: `import nltk`

- **spaCy**: Industrial-strength NLP
  - Installation: `pip install spacy`
  - Import: `import spacy`

### Time Series Analysis
- **statsmodels**: Statistical models and tests
  - Installation: `pip install statsmodels`
  - Import: `import statsmodels.api as sm`

- **Prophet**: Time series forecasting
  - Installation: `pip install prophet`
  - Import: `from prophet import Prophet`

### Feature Engineering
- **featuretools**: Automated feature engineering
  - Installation: `pip install featuretools`
  - Import: `import featuretools as ft`

## Model Deployment

### Model Saving/Loading
- **joblib**: Efficient saving/loading of scikit-learn models
  - Installation: `pip install joblib`
  - Import: `import joblib`
  - Key functions: `dump()`, `load()`

### Web Frameworks
- **Flask**: Lightweight web framework
  - Installation: `pip install flask`
  - Import: `from flask import Flask`

- **FastAPI**: Modern, fast web framework
  - Installation: `pip install fastapi uvicorn`
  - Import: `from fastapi import FastAPI`
