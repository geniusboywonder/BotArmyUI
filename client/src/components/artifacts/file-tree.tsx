import { Download, Folder, FolderOpen, FileText } from 'lucide-react';
import { ArtifactFile } from '@/lib/artifacts-data';
import { Button } from '@/components/ui/button';

interface FileTreeProps {
  items: ArtifactFile[];
  expandedFolders: Set<string>;
  onToggleFolder: (folderName: string) => void;
  level?: number;
}

export function FileTree({ items, expandedFolders, onToggleFolder, level = 0 }: FileTreeProps) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ marginLeft: level * 20 }}>
          {item.type === 'folder' ? (
            <div>
              <div 
                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded"
                onClick={() => onToggleFolder(item.name)}
                data-testid={`button-folder-${item.name}`}
              >
                {expandedFolders.has(item.name) ? (
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                ) : (
                  <Folder className="w-4 h-4 text-blue-500" />
                )}
                <span className="text-sm font-medium">{item.name}</span>
              </div>
              {expandedFolders.has(item.name) && item.children && (
                <div>
                  <FileTree 
                    items={item.children} 
                    expandedFolders={expandedFolders}
                    onToggleFolder={onToggleFolder}
                    level={level + 1}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm" data-testid={`text-file-${item.name}`}>
                  {item.name}
                </span>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs"
                data-testid={`button-download-${item.name}`}
              >
                <a href={item.url} className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Download
                </a>
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
