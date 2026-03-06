export interface Session {
    id: string;
    name: string;
    date: string;
    type: 'voice' | 'screenshot' | 'screen-share';
    status: 'active' | 'completed' | 'paused';
    issueCount: number;
    fixedCount: number;
    confidenceScore: number;
}

export interface Issue {
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    confidence: number;
    boundingBox?: BoundingBox;
    suggestedFix?: SuggestedFix;
    status: 'detected' | 'previewing' | 'applied' | 'dismissed';
}

export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    color: 'red' | 'yellow' | 'blue';
}

export interface SuggestedFix {
    file: string;
    patch: string;
    explanation: string;
    confidence: number;
}

export interface AgentMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
    type: 'text' | 'voice' | 'image' | 'analysis';
    imageUrl?: string;
    issues?: Issue[];
}

export interface Agent {
    id: string;
    name: string;
    avatar: string;
    status: 'available' | 'busy' | 'offline';
    specialization: string;
}

export interface ActionLog {
    id: string;
    action: string;
    reason: string;
    approver: string;
    timestamp: string;
    status: 'pending' | 'executed' | 'reverted';
    patch?: string;
}

export interface SessionReport {
    sessionId: string;
    issuesSummary: Issue[];
    appliedFixes: SuggestedFix[];
    performanceScore: number;
    duration: string;
    generatedAt: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar: string;
    provider: 'google' | 'github' | 'sso';
}
