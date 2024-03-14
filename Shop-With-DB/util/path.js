import path from 'path';

const mainFilename = import.meta?.filename; // retrieves the filename of the main module (the entry point) of your Node.js application.
const directoryName = mainFilename ? path.dirname(mainFilename) : '';

// path.dirname() takes a file path as an argument and returns the directory name portion of the path.

export default directoryName;
