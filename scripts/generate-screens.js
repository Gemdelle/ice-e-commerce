const fs = require('fs');
const path = require('path');

// Get component name from the command line
const componentName = process.argv[2];

if (!componentName) {
    console.error('Please provide a component name.');
    process.exit(1);
}

// Paths (one level up)
const componentDir = path.join(__dirname, '../src/screens', componentName);
const componentFile = path.join(componentDir, `${componentName}.tsx`); // Using .tsx for TypeScript
const cssFile = path.join(componentDir, `${componentName}.css`);

// Check if component already exists
if (fs.existsSync(componentDir)) {
    console.error('Component already exists.');
    process.exit(1);
}

// Create the directory
fs.mkdirSync(componentDir, { recursive: true });

// JSX/TSX template
const componentTemplate = `
import React, { FC } from 'react';
import './${componentName}.css';

interface ${componentName}Props {
  param1: number;
}

const ${componentName}: FC<${componentName}Props> = ({ param1 }) => (
  <div className='${componentName.toLowerCase()}'>
    ${componentName} Component
  </div>
);

export default ${componentName};
`;

// CSS template
const cssTemplate = `
.${componentName.toLowerCase()} {
  /* Add your styles here */
}
`;

// Write the files
fs.writeFileSync(componentFile, componentTemplate);
fs.writeFileSync(cssFile, cssTemplate);

console.log(`Component ${componentName} has been created in ../src/screens/${componentName}`);
