"""Dataset parser skills for the OpenHands agent.

This module provides functions to parse and extract content from different dataset file types,
including CSV, JSON, XLSX, and Parquet files. It formats the data in a way that's suitable
for LLM processing.

Functions:
    parse_csv(file_path: str, max_rows: int = 10) -> None: Parse and print content of a CSV file.
    parse_json(file_path: str, max_items: int = 10) -> None: Parse and print content of a JSON file.
    parse_xlsx(file_path: str, sheet_index: int = 0, max_rows: int = 10) -> None: Parse and print content of an Excel file.
    parse_parquet(file_path: str, max_rows: int = 10) -> None: Parse and print content of a Parquet file.
    parse_dataset(file_path: str, max_rows: int = 10) -> None: Auto-detect and parse any supported dataset file.
"""

import csv
import json
import os
from typing import Any, Dict, List, Optional, Union

import pandas as pd


def parse_csv(file_path: str, max_rows: int = 10) -> None:
    """Parses the content of a CSV file and prints it in a format suitable for LLMs.

    Args:
        file_path: str: The path to the CSV file to open.
        max_rows: int: Maximum number of rows to display (default: 10).
    """
    print(f'[Reading CSV dataset from {file_path}]')
    
    try:
        # Read the CSV file
        df = pd.read_csv(file_path)
        
        # Get basic information
        total_rows, total_cols = df.shape
        column_names = df.columns.tolist()
        
        # Print dataset summary
        print(f"Dataset Summary:")
        print(f"- Total rows: {total_rows}")
        print(f"- Total columns: {total_cols}")
        print(f"- Column names: {', '.join(column_names)}")
        print("\nColumn Data Types:")
        for col, dtype in df.dtypes.items():
            print(f"- {col}: {dtype}")
        
        # Print basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        if numeric_cols:
            print("\nNumeric Column Statistics:")
            stats = df[numeric_cols].describe().transpose()
            for col, row in stats.iterrows():
                print(f"- {col}: min={row['min']:.2f}, max={row['max']:.2f}, mean={row['mean']:.2f}, std={row['std']:.2f}")
        
        # Print sample data
        print(f"\nSample Data (first {min(max_rows, len(df))} rows):")
        print(df.head(max_rows).to_string(index=False))
        
        if total_rows > max_rows:
            print(f"\n[...{total_rows - max_rows} more rows not shown...]")
    
    except Exception as e:
        print(f"Error parsing CSV file: {e}")


def parse_json(file_path: str, max_items: int = 10) -> None:
    """Parses the content of a JSON file and prints it in a format suitable for LLMs.

    Args:
        file_path: str: The path to the JSON file to open.
        max_items: int: Maximum number of items to display for arrays (default: 10).
    """
    print(f'[Reading JSON dataset from {file_path}]')
    
    try:
        # Read the JSON file
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Determine the structure of the JSON
        if isinstance(data, list):
            print(f"JSON Array Dataset:")
            print(f"- Total items: {len(data)}")
            
            if data and isinstance(data[0], dict):
                # Get keys from the first item
                keys = list(data[0].keys())
                print(f"- Fields: {', '.join(keys)}")
                
                # Convert to DataFrame for easier handling
                df = pd.DataFrame(data[:max_items])
                print(f"\nSample Data (first {min(max_items, len(data))} items):")
                print(df.to_string(index=False))
                
                if len(data) > max_items:
                    print(f"\n[...{len(data) - max_items} more items not shown...]")
            else:
                # Simple array
                display_items = data[:max_items]
                print(f"\nSample Data (first {len(display_items)} items):")
                for i, item in enumerate(display_items):
                    print(f"{i}: {item}")
                
                if len(data) > max_items:
                    print(f"\n[...{len(data) - max_items} more items not shown...]")
        
        elif isinstance(data, dict):
            print(f"JSON Object Dataset:")
            print(f"- Total keys: {len(data)}")
            print(f"- Top-level keys: {', '.join(list(data.keys())[:20])}")
            
            # Print a sample of the data
            print("\nSample Data (structure preview):")
            _print_json_structure(data, max_depth=2, max_items=max_items)
        
        else:
            print(f"JSON Data (primitive type):")
            print(data)
    
    except Exception as e:
        print(f"Error parsing JSON file: {e}")


def _print_json_structure(data: Any, max_depth: int = 2, current_depth: int = 0, max_items: int = 10) -> None:
    """Helper function to print a readable structure of JSON data."""
    indent = "  " * current_depth
    
    if current_depth >= max_depth:
        print(f"{indent}[...]")
        return
    
    if isinstance(data, dict):
        for i, (key, value) in enumerate(data.items()):
            if i >= max_items:
                print(f"{indent}[...{len(data) - max_items} more keys not shown...]")
                break
            
            if isinstance(value, (dict, list)):
                print(f"{indent}{key}:")
                _print_json_structure(value, max_depth, current_depth + 1, max_items)
            else:
                print(f"{indent}{key}: {value}")
    
    elif isinstance(data, list):
        if not data:
            print(f"{indent}[]")
            return
        
        display_items = data[:max_items]
        if isinstance(display_items[0], (dict, list)):
            for i, item in enumerate(display_items):
                print(f"{indent}Item {i}:")
                _print_json_structure(item, max_depth, current_depth + 1, max_items)
        else:
            print(f"{indent}{display_items}")
        
        if len(data) > max_items:
            print(f"{indent}[...{len(data) - max_items} more items not shown...]")
    
    else:
        print(f"{indent}{data}")


def parse_xlsx(file_path: str, sheet_index: int = 0, max_rows: int = 10) -> None:
    """Parses the content of an Excel file and prints it in a format suitable for LLMs.

    Args:
        file_path: str: The path to the Excel file to open.
        sheet_index: int: Index of the sheet to read (default: 0, first sheet).
        max_rows: int: Maximum number of rows to display (default: 10).
    """
    print(f'[Reading Excel dataset from {file_path}]')
    
    try:
        # Read the Excel file
        xl = pd.ExcelFile(file_path)
        sheet_names = xl.sheet_names
        
        print(f"Excel Workbook:")
        print(f"- Available sheets: {', '.join(sheet_names)}")
        
        # Use the specified sheet or default to the first one
        sheet_name = sheet_names[sheet_index]
        print(f"\nReading sheet: {sheet_name}")
        
        df = pd.read_excel(file_path, sheet_name=sheet_name)
        
        # Get basic information
        total_rows, total_cols = df.shape
        column_names = df.columns.tolist()
        
        # Print dataset summary
        print(f"Dataset Summary:")
        print(f"- Total rows: {total_rows}")
        print(f"- Total columns: {total_cols}")
        print(f"- Column names: {', '.join(column_names)}")
        print("\nColumn Data Types:")
        for col, dtype in df.dtypes.items():
            print(f"- {col}: {dtype}")
        
        # Print basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        if numeric_cols:
            print("\nNumeric Column Statistics:")
            stats = df[numeric_cols].describe().transpose()
            for col, row in stats.iterrows():
                print(f"- {col}: min={row['min']:.2f}, max={row['max']:.2f}, mean={row['mean']:.2f}, std={row['std']:.2f}")
        
        # Print sample data
        print(f"\nSample Data (first {min(max_rows, len(df))} rows):")
        print(df.head(max_rows).to_string(index=False))
        
        if total_rows > max_rows:
            print(f"\n[...{total_rows - max_rows} more rows not shown...]")
    
    except Exception as e:
        print(f"Error parsing Excel file: {e}")


def parse_parquet(file_path: str, max_rows: int = 10) -> None:
    """Parses the content of a Parquet file and prints it in a format suitable for LLMs.

    Args:
        file_path: str: The path to the Parquet file to open.
        max_rows: int: Maximum number of rows to display (default: 10).
    """
    print(f'[Reading Parquet dataset from {file_path}]')
    
    try:
        # Read the Parquet file
        df = pd.read_parquet(file_path)
        
        # Get basic information
        total_rows, total_cols = df.shape
        column_names = df.columns.tolist()
        
        # Print dataset summary
        print(f"Dataset Summary:")
        print(f"- Total rows: {total_rows}")
        print(f"- Total columns: {total_cols}")
        print(f"- Column names: {', '.join(column_names)}")
        print("\nColumn Data Types:")
        for col, dtype in df.dtypes.items():
            print(f"- {col}: {dtype}")
        
        # Print basic statistics for numeric columns
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        if numeric_cols:
            print("\nNumeric Column Statistics:")
            stats = df[numeric_cols].describe().transpose()
            for col, row in stats.iterrows():
                print(f"- {col}: min={row['min']:.2f}, max={row['max']:.2f}, mean={row['mean']:.2f}, std={row['std']:.2f}")
        
        # Print sample data
        print(f"\nSample Data (first {min(max_rows, len(df))} rows):")
        print(df.head(max_rows).to_string(index=False))
        
        if total_rows > max_rows:
            print(f"\n[...{total_rows - max_rows} more rows not shown...]")
    
    except Exception as e:
        print(f"Error parsing Parquet file: {e}")


def parse_dataset(file_path: str, max_rows: int = 10) -> None:
    """Auto-detects and parses any supported dataset file.

    Args:
        file_path: str: The path to the dataset file to open.
        max_rows: int: Maximum number of rows to display (default: 10).
    """
    file_extension = os.path.splitext(file_path)[1].lower()
    
    if file_extension == '.csv':
        parse_csv(file_path, max_rows)
    elif file_extension == '.json':
        parse_json(file_path, max_rows)
    elif file_extension in ['.xlsx', '.xls']:
        parse_xlsx(file_path, 0, max_rows)
    elif file_extension == '.parquet':
        parse_parquet(file_path, max_rows)
    else:
        print(f"Unsupported dataset file format: {file_extension}")
        print(f"Supported formats: .csv, .json, .xlsx, .xls, .parquet")


__all__ = [
    'parse_csv',
    'parse_json',
    'parse_xlsx',
    'parse_parquet',
    'parse_dataset',
]
