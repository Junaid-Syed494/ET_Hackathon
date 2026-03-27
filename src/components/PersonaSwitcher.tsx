"use client";

import React from 'react';

// Define the available personas based on the ET guide
export type PersonaId = 'ALL' | 'MACRO' | 'TECH' | 'RETAIL';

interface Persona {
    id: PersonaId;
    label: string;
    icon: string;
}

const PERSONAS: Persona[] = [
    { id: 'ALL', label: 'Live Feed', icon: '⚡' },
    { id: 'MACRO', label: 'Macro Economy', icon: '🏦' },
    { id: 'TECH', label: 'Tech & Startups', icon: '🚀' },
    { id: 'RETAIL', label: 'Consumer Retail', icon: '🛍️' },
];

interface PersonaSwitcherProps {
    activePersona: PersonaId;
    onSelectPersona: (id: PersonaId) => void;
}

const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({
    activePersona,
    onSelectPersona
}) => {
    return (
        <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-10 py-3">
            <div className="max-w-4xl mx-auto px-4 overflow-x-auto hide-scrollbar">
                <div className="flex space-x-2">
                    {PERSONAS.map((persona) => {
                        const isActive = activePersona === persona.id;
                        return (
                            <button
                                key={persona.id}
                                onClick={() => onSelectPersona(persona.id)}
                                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${isActive
                                        ? 'bg-red-50 text-red-700 ring-1 ring-red-200 shadow-sm'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }
                `}
                            >
                                <span>{persona.icon}</span>
                                <span>{persona.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PersonaSwitcher;
