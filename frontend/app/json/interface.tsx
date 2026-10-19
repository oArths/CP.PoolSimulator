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
    image: string;
}

interface PoolDeck {
    name: string;
    imagePath: string;
}

interface PoolDisplay {
    color: string;
    imagePath: string
}

interface PoolAvailable {
    formats: PoolFormat[];
    surrounded: PoolSurrounded[];
    gates: PoolGate[];
    deck: PoolDeck[];
    display: PoolDisplay[];
}