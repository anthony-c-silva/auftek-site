import React from 'react';
import { Section, SectionTitle } from '../../components/ui/Section';
import { TEAM_MEMBERS } from '../../data/constants';

export const Team: React.FC = () => {
    return (
        <Section id="time">
            <SectionTitle subtitle="Mentes Brilhantes">Nosso Time</SectionTitle>
            <div className="grid md:grid-cols-4 gap-6">
                {TEAM_MEMBERS.map((member, i) => (
                    <div key={i} className="group text-center">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-auftek-blue transition-colors">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h4 className="text-white font-bold">{member.name}</h4>
                        <p className="text-auftek-blue text-sm">
                            {member.role}
                        </p>
                    </div>
                ))}
            </div>
        </Section>
    );
};
