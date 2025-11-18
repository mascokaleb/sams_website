import { aboutSection } from './documents/aboutSection';
import { academicsSection } from './documents/academicsSection';
import { contactSection } from './documents/contactSection';
import { dualSportSection } from './documents/dualSportSection';
import { galleryPhoto } from './documents/galleryPhoto';
import { gallerySection } from './documents/gallerySection';
import { heroSection } from './documents/heroSection';
import { highlightEvent } from './documents/highlightEvent';
import { highlightsSection } from './documents/highlightsSection';
import { resumeSection } from './documents/resumeSection';
import { siteSettings } from './documents/siteSettings';
import { videoHighlight } from './documents/videoHighlight';
import { videosSection } from './documents/videosSection';
import { blockContent } from './objects/blockContent';
import { contactCard } from './objects/contactCard';
import { contactEntry } from './objects/contactEntry';
import { cta } from './objects/cta';
import { dualCard } from './objects/dualCard';
import { metric } from './objects/metric';
import { profileFact } from './objects/profileFact';
import { quickHit } from './objects/quickHit';
import { statItem } from './objects/statItem';
import { tournamentDay } from './objects/tournamentDay';

export const schemaTypes = [
  // documents
  siteSettings,
  heroSection,
  aboutSection,
  resumeSection,
  academicsSection,
  highlightsSection,
  highlightEvent,
  videosSection,
  gallerySection,
  videoHighlight,
  galleryPhoto,
  dualSportSection,
  contactSection,
  // objects
  blockContent,
  metric,
  cta,
  profileFact,
  quickHit,
  statItem,
  tournamentDay,
  dualCard,
  contactCard,
  contactEntry,
];
