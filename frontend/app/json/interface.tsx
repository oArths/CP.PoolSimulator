interface PoolFormat {
    component: string;
    name: string;
}

interface PoolSurrounded {
    type: string;
    description: string;
}

interface PoolGate {
    type: string;
    component: string;
}

interface PoolDeck {    
    name: string;
    imagePath: string;
    texture: string;
}

interface PoolDisplay {
    name: string;
    imagePath: string
    color: string;
}

interface PoolAvailable {
    formats: PoolFormat[];
    surrounded: PoolSurrounded[];
    gates: PoolGate[];
    deck: PoolDeck[];
    display: PoolDisplay[];
}