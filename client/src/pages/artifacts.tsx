import { useState } from 'react';
import { Archive, FileText, Database, Terminal, CheckCircle, Settings, AlertCircle, BookOpen, Download } from 'lucide-react';
import { artifactsData, artifactTabs, ArtifactItem } from '@/lib/artifacts-data';
import { FileTree } from '@/components/artifacts/file-tree';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const iconMap = {
  FileText,
  Database,
  Terminal,
  CheckCircle,
  Settings,
  AlertCircle,
};

export default function Artifacts() {
  const [activeTab, setActiveTab] = useState('requirements');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['source_code', 'documentation']));

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const renderArtifactContent = (tabId: string) => {
    const data = artifactsData[tabId as keyof typeof artifactsData];

    if (tabId === 'development' && typeof data === 'object' && !Array.isArray(data)) {
      // Special handling for development tab with file tree structure
      return (
        <div className="space-y-6">
          {Object.entries(data).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-semibold text-lg mb-3 capitalize flex items-center gap-2">
                {section === 'source_code' ? (
                  <Terminal className="w-5 h-5 text-blue-500" />
                ) : (
                  <BookOpen className="w-5 h-5 text-blue-500" />
                )}
                {section.replace('_', ' ')}
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <FileTree 
                  items={items}
                  expandedFolders={expandedFolders}
                  onToggleFolder={toggleFolder}
                />
              </div>
            </div>
          ))}
        </div>
      );
    } else if (Array.isArray(data)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item: ArtifactItem, index: number) => (
            <Card key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm" data-testid={`text-artifact-${item.name}`}>
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
                <div className="text-xs text-gray-600 dark:text-gray-400">{item.type}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    return null;
  };

  const getTabDescription = (tabId: string) => {
    const descriptions = {
      requirements: 'Requirements documents and user stories from the Analyst agent',
      design: 'Architecture diagrams and design models from the Architect agent',
      development: 'Navigate through the generated source code and documentation',
      testing: 'Test plans, cases, and scripts from the Testing agent',
      deployment: 'Deployment scripts and configuration files from the Deployment agent',
      maintenance: 'Monitoring reports and logs from the Maintenance agent'
    };
    return descriptions[tabId as keyof typeof descriptions] || '';
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Archive className="w-6 h-6" />
        Project Artifacts
      </h2>
      
      <Card>
        {/* Tab Navigation */}
        <CardHeader className="pb-0">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex overflow-x-auto">
              {artifactTabs.map(tab => {
                const IconComponent = iconMap[tab.icon as keyof typeof iconMap];
                return (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap rounded-none",
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    data-testid={`button-artifact-tab-${tab.id}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardHeader>

        {/* Tab Content */}
        <CardContent className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {getTabDescription(activeTab)}
          </p>
          <div data-testid={`div-artifact-content-${activeTab}`}>
            {renderArtifactContent(activeTab)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
