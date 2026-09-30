const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/images/wreath-logo.svg');
const indexPath = path.join(__dirname, '../index.html');

const svgContent = fs.readFileSync(svgPath, 'utf8');
let html = fs.readFileSync(indexPath, 'utf8');

const innerSvgMatch = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
if (innerSvgMatch) {
  // Strip the text from the loader icon because the brand text is styled below it
  const innerSvg = innerSvgMatch[1].replace(/<g class="wreath-brand-text">[\s\S]*?<\/g>/, '');
  const loaderWrapRegex = /<div class="loader-wreath-wrap">[\s\S]*?<\/div>/;
  const newLoaderWrap = `<div class="loader-wreath-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" class="loader-wreath-svg">
          ${innerSvg}
        </svg>
      </div>`;
  html = html.replace(loaderWrapRegex, newLoaderWrap);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('Successfully inlined full botanical wreath into index.html preloader');
} else {
  console.error('Could not parse SVG');
}
