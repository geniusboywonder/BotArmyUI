export interface ArtifactFile {
  name: string;
  type: 'file' | 'folder';
  url?: string;
  children?: ArtifactFile[];
}

export interface ArtifactItem {
  name: string;
  type: string;
  url: string;
}

export const artifactsData = {
  requirements: [
    { name: 'requirements.md', type: 'Requirements Document', url: 'https://yourserver.com/artifacts/requirements/requirements.md' },
    { name: 'use_cases.md', type: 'Use Cases', url: 'https://yourserver.com/artifacts/requirements/use_cases.md' },
    { name: 'user_stories.md', type: 'User Stories', url: 'https://yourserver.com/artifacts/requirements/user_stories.md' },
  ] as ArtifactItem[],
  design: [
    { name: 'architecture_diagram.png', type: 'Architecture Diagram', url: 'https://yourserver.com/artifacts/design/architecture_diagram.png' },
    { name: 'system_design.md', type: 'System Design', url: 'https://yourserver.com/artifacts/design/system_design.md' },
    { name: 'ui_mockups.pdf', type: 'UI Mockups', url: 'https://yourserver.com/artifacts/design/ui_mockups.pdf' },
  ] as ArtifactItem[],
  development: {
    source_code: [
      { name: 'main.py', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/main.py' },
      { name: 'utils.py', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/utils.py' },
      { 
        name: 'components/', 
        type: 'folder', 
        children: [
          { name: 'Button.jsx', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/components/Button.jsx' },
          { name: 'Modal.jsx', type: 'file', url: 'https://yourserver.com/artifacts/development/source_code/components/Modal.jsx' },
        ]
      },
    ] as ArtifactFile[],
    documentation: [
      { name: 'api_docs.md', type: 'file', url: 'https://yourserver.com/artifacts/development/documentation/api_docs.md' },
      { name: 'setup_guide.md', type: 'file', url: 'https://yourserver.com/artifacts/development/documentation/setup_guide.md' },
    ] as ArtifactFile[],
  },
  testing: [
    { name: 'test_plan.md', type: 'Test Plan', url: 'https://yourserver.com/artifacts/testing/test_plan.md' },
    { name: 'test_cases.xlsx', type: 'Test Cases', url: 'https://yourserver.com/artifacts/testing/test_cases.xlsx' },
    { name: 'test_script.sh', type: 'Test Script', url: 'https://yourserver.com/artifacts/testing/test_script.sh' },
  ] as ArtifactItem[],
  deployment: [
    { name: 'deploy_script.sh', type: 'Deployment Script', url: 'https://yourserver.com/artifacts/deployment/deploy_script.sh' },
    { name: 'config.json', type: 'Configuration', url: 'https://yourserver.com/artifacts/deployment/config.json' },
    { name: 'docker-compose.yml', type: 'Docker Config', url: 'https://yourserver.com/artifacts/deployment/docker-compose.yml' },
  ] as ArtifactItem[],
  maintenance: [
    { name: 'monitoring_report.md', type: 'Monitoring Report', url: 'https://yourserver.com/artifacts/maintenance/monitoring_report.md' },
    { name: 'error_logs.txt', type: 'Error Logs', url: 'https://yourserver.com/artifacts/maintenance/error_logs.txt' },
    { name: 'performance_metrics.json', type: 'Performance Metrics', url: 'https://yourserver.com/artifacts/maintenance/performance_metrics.json' },
  ] as ArtifactItem[],
};

export const artifactTabs = [
  { id: 'requirements', name: 'Requirements', icon: 'FileText' },
  { id: 'design', name: 'Design', icon: 'Database' },
  { id: 'development', name: 'Development', icon: 'Terminal' },
  { id: 'testing', name: 'Testing', icon: 'CheckCircle' },
  { id: 'deployment', name: 'Deployment', icon: 'Settings' },
  { id: 'maintenance', name: 'Maintenance', icon: 'AlertCircle' },
];
