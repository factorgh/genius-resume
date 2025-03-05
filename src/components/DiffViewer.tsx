import React from 'react';

interface DiffViewerProps {
  original: string;
  enhanced: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ original, enhanced }) => {
  // Create a simple diff visualization by splitting into words and comparing
  const originalWords = original.split(/\s+/);
  const enhancedWords = enhanced.split(/\s+/);
  
  // Highlight added words in green, removed words in red, unchanged in normal text
  const renderDiff = () => {
    // Very simple diff algorithm (not perfect but works for basic cases)
    let i = 0, j = 0;
    const result = [];
    
    while (i < originalWords.length || j < enhancedWords.length) {
      if (i >= originalWords.length) {
        // All remaining enhanced words are additions
        result.push(
          <span key={`added-${j}`} className="bg-green-100 text-green-800 px-1 rounded">
            {enhancedWords[j]}{' '}
          </span>
        );
        j++;
      } else if (j >= enhancedWords.length) {
        // All remaining original words are deletions
        result.push(
          <span key={`removed-${i}`} className="bg-red-100 text-red-800 line-through px-1 rounded">
            {originalWords[i]}{' '}
          </span>
        );
        i++;
      } else if (originalWords[i].toLowerCase() === enhancedWords[j].toLowerCase()) {
        // Words match, keep them
        result.push(<span key={`same-${i}`}>{enhancedWords[j]} </span>);
        i++;
        j++;
      } else {
        // Words don't match
        // Check if next word matches
        let foundMatch = false;
        
        // Look ahead in enhanced text to see if there's a match
        for (let k = j + 1; k < j + 4 && k < enhancedWords.length; k++) {
          if (originalWords[i].toLowerCase() === enhancedWords[k].toLowerCase()) {
            // Found match ahead, words before it are additions
            for (let l = j; l < k; l++) {
              result.push(
                <span key={`added-${l}`} className="bg-green-100 text-green-800 px-1 rounded">
                  {enhancedWords[l]}{' '}
                </span>
              );
            }
            j = k;
            foundMatch = true;
            break;
          }
        }
        
        // Look ahead in original text to see if there's a match
        if (!foundMatch) {
          for (let k = i + 1; k < i + 4 && k < originalWords.length; k++) {
            if (originalWords[k].toLowerCase() === enhancedWords[j].toLowerCase()) {
              // Found match ahead, words before it are deletions
              for (let l = i; l < k; l++) {
                result.push(
                  <span key={`removed-${l}`} className="bg-red-100 text-red-800 line-through px-1 rounded">
                    {originalWords[l]}{' '}
                  </span>
                );
              }
              i = k;
              foundMatch = true;
              break;
            }
          }
        }
        
        // If no match found, treat as a replacement
        if (!foundMatch) {
          result.push(
            <span key={`removed-${i}`} className="bg-red-100 text-red-800 line-through px-1 rounded">
              {originalWords[i]}{' '}
            </span>
          );
          result.push(
            <span key={`added-${j}`} className="bg-green-100 text-green-800 px-1 rounded">
              {enhancedWords[j]}{' '}
            </span>
          );
          i++;
          j++;
        }
      }
    }
    
    return result;
  };

  return (
    <div className="font-mono text-sm whitespace-pre-wrap">
      <div className="mb-2 flex space-x-4 text-xs">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-100 rounded mr-1"></span>
          <span className="text-gray-600">Added</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-100 rounded mr-1"></span>
          <span className="text-gray-600">Removed</span>
        </div>
      </div>
      <div className="p-3 bg-gray-50 rounded-md border border-gray-200">{renderDiff()}</div>
    </div>
  );
};

export default DiffViewer;
