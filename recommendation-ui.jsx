import React from 'react';
import { Sparkles, Check, ArrowUpRight } from 'lucide-react';
import { useProfile } from './profile.jsx';
import { rankRecommendations } from './recommendations.js';
import './recommendations.css';

const starters = ['Coding', 'Engineering', 'Business', 'Finance', 'Photography', 'Music', 'Gaming', 'Hiking', 'Healthcare', 'Sustainability', 'Volunteering', 'Research'];
export function RecommendationIntro({ kind, onEditProfile }) {
  const { profile, interests, starterInterests, setStarterInterests } = useProfile();
  return <section className="recommendation-intro"><div><Sparkles size={18}/><div><h2>{profile ? 'Your shared interests come first.' : interests.length ? 'Your first picks are taking shape.' : 'Start with what makes you curious.'}</h2><p>{profile ? 'The most shared interests come first. Major and related topics break ties. Green shows actual matches.' : interests.length ? `Using your ${interests.length} selected interests to find relevant ${kind}.` : `No history needed. Pick a few interests to personalize ${kind}, or explore a mix of campus possibilities.`}</p></div></div>{!profile && <div className="starter-interest-options">{starters.map(interest => <button key={interest} type="button" aria-pressed={starterInterests.includes(interest)} onClick={() => setStarterInterests(previous => previous.includes(interest) ? previous.filter(value => value !== interest) : [...previous, interest])}>{starterInterests.includes(interest) && <Check size={12}/>} {interest}</button>)}</div>}{onEditProfile && <button type="button" className="text-button" onClick={onEditProfile}>{profile ? 'Tune my profile' : 'Create my profile'}<ArrowUpRight size={14}/></button>}</section>;
}

export function RecommendationReason({ item, kind = 'clubs' }) {
  const { profile, interests, feedback } = useProfile();
  const recommendation = item.recommendation || rankRecommendations([{ ...item, owned: false, legacySample: false }], { profile, interests, feedback, kind })[0]?.recommendation;
  if (!recommendation) return null;
  return <div className={`recommendation-reason ${recommendation.personalized ? 'has-reasons' : 'exploration-reason'}`}><Sparkles size={15}/><div><strong>{recommendation.personalized ? 'Why this could be a fit' : 'A little room to explore'}</strong>{recommendation.reasons.map((reason, index) => <p key={index} className={reason.type === 'shared' ? 'actual-shared-reason' : ''}>{reason.text}</p>)}</div></div>;
}
