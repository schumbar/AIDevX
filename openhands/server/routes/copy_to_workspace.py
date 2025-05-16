import os
import shutil
from typing import Any, List
import glob

from fastapi import APIRouter, HTTPException, UploadFile, Form, status
from fastapi.responses import JSONResponse

from openhands.core.logger import openhands_logger as logger

app = APIRouter(prefix='/api')


@app.post(
    '/clear-workspace',
    response_model=dict[str, Any],
    responses={
        200: {'description': 'Workspace cleared successfully', 'model': dict},
        500: {'description': 'Error clearing workspace', 'model': dict},
    },
)
async def clear_workspace() -> JSONResponse:
    """Clear the workspace directory, including all files in the uploads folder.

    This endpoint removes all files and directories in the workspace directory.
    It keeps the uploads directory itself but removes all files within it.

    Returns:
        JSONResponse: A JSON response indicating the success of the operation.
    """
    try:
        # Get the workspace directory path
        workspace_base = os.environ.get('WORKSPACE_BASE', '/opt/workspace_base')
        logger.info(f'Clearing workspace directory: "{workspace_base}"')

        # Create the uploads directory if it doesn't exist
        uploads_dir = os.path.join(workspace_base, 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)

        # Get all items in the workspace directory
        items = glob.glob(os.path.join(workspace_base, '*'))

        # Track removed items for logging
        removed_items = []

        # Process each item in the workspace directory
        for item in items:
            item_basename = os.path.basename(item)

            if item_basename == 'uploads':
                # For the uploads directory, remove all files inside it
                upload_files = glob.glob(os.path.join(item, '*'))
                for upload_file in upload_files:
                    try:
                        if os.path.isdir(upload_file):
                            shutil.rmtree(upload_file)
                        else:
                            os.remove(upload_file)
                        removed_items.append(f"uploads/{os.path.basename(upload_file)}")
                        logger.info(f'Removed: {upload_file}')
                    except Exception as e:
                        logger.error(f'Error removing file {upload_file}: {e}')
            else:
                # For other items, remove them completely
                try:
                    if os.path.isdir(item):
                        shutil.rmtree(item)
                    else:
                        os.remove(item)
                    removed_items.append(item_basename)
                    logger.info(f'Removed: {item}')
                except Exception as e:
                    logger.error(f'Error removing item {item}: {e}')

        logger.info(f'Workspace cleared successfully. Removed {len(removed_items)} items.')

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                'message': 'Workspace cleared successfully',
                'removed_items': removed_items,
            },
        )
    except Exception as e:
        logger.error(f'Error clearing workspace: {e}')
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={'error': f'Error clearing workspace: {e}'},
        )


@app.post(
    '/copy-to-workspace',
    response_model=dict[str, Any],
    responses={
        200: {'description': 'File copied successfully', 'model': dict},
        400: {'description': 'Invalid destination path', 'model': dict},
        500: {'description': 'Error copying file', 'model': dict},
    },
)
async def copy_to_workspace(
    file: UploadFile,
    destination: str = Form('uploads'),
) -> JSONResponse:
    """Copy a file to the workspace directory.

    This endpoint allows copying files directly to the workspace directory,
    which is mounted to the runtime container.

    Args:
        file (UploadFile): The file to copy.
        destination (str): The subdirectory within workspace to copy to.

    Returns:
        JSONResponse: A JSON response indicating the success of the operation.
    """
    try:
        # Get the workspace directory path
        # Use the environment variable WORKSPACE_BASE if it exists, otherwise use the default
        workspace_base = os.environ.get('WORKSPACE_BASE', '/opt/workspace_base')
        logger.info(f'Workspace base directory: "{workspace_base}"')

        # Always use 'uploads' subdirectory for dataset files
        logger.info(f'Original destination: "{destination}"')
        destination = 'uploads' if not destination else destination
        logger.info(f'Final destination: "{destination}"')

        # Create the full destination path
        full_dest_path = os.path.join(workspace_base, destination)
        logger.info(f'Full destination path: "{full_dest_path}"')

        # Create the directory if it doesn't exist
        os.makedirs(full_dest_path, exist_ok=True)

        # Save the file
        file_path = os.path.join(full_dest_path, file.filename)
        with open(file_path, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f'File {file.filename} copied to {full_dest_path}')

        # Construct the path relative to the workspace
        relative_path = os.path.join('/workspace', destination, file.filename)
        relative_path = relative_path.replace('\\', '/').replace('//', '/')

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                'filename': file.filename,
                'destination': destination,
                'path': relative_path,
            },
        )
    except Exception as e:
        logger.error(f'Error copying file to workspace: {e}')
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={'error': f'Error copying file to workspace: {e}'},
        )
