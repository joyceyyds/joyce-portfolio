import {photoFrameOpen, WORKS_SCENE_IMAGES} from '../components/portfolio/worksSceneAssets';

import productNotebookOpen from '../assets/works/product/product-notebook-open.png';

import facai from '../assets/works/content/facai-optimized.png';
import joyceAi from '../assets/works/content/joyce-ai-optimized.png';
import liubai from '../assets/works/content/liubai-optimized.png';

import aiVideo01 from '../assets/works/ai/video/ai-video-01.webp';
import aiVideo02 from '../assets/works/ai/video/ai-video-02.webp';
import aiVideo03 from '../assets/works/ai/video/ai-video-03.webp';
import aiVideo04 from '../assets/works/ai/video/ai-video-04.webp';
import aiVideo05 from '../assets/works/ai/video/ai-video-05.webp';

import yuwang from '../assets/works/film/yuwang.webp';
import mujianMuji from '../assets/works/film/mujian-muji.webp';
import dragonSeeker from '../assets/works/film/dragon-seeker.webp';
import workInProgress from '../assets/works/film/work-in-progress.webp';

import aboutWoodBackground from '../assets/about/about-wood-background.png';
import folderClosed from '../assets/about/folder-closed.png';
import folderOpen from '../assets/about/folder-open.png';
import photo from '../assets/about/photo.png';
import capabilityTicket from '../assets/about/capability-ticket-optimized.png';
import thingsILike from '../assets/about/things-i-like-optimized.png';
import quotePaper from '../assets/about/quote-paper.png';
import internship from '../assets/about/internship.png';
import welcomeTag from '../assets/about/welcome-tag-optimized.png';
import contactMailbox from '../assets/about/contact-mailbox.png';
import aboutLamp from '../assets/about/about-lamp.png';
import aboutSwitchLamp from '../assets/about/about-switch-lamp.png';
import aboutLightOverlay from '../assets/about/about-light-overlay.png';

import contactBackground from '../assets/contact/contact-background-new.webp';
import contactMailboxMain from '../assets/contact/contact-mailbox-main.png';
import contactEnvelopeClosed from '../assets/contact/contact-envelope-closed.png';
import contactEnvelopeOpenBack from '../assets/contact/contact-envelope-open-back.png';
import contactEnvelopeOpenBase from '../assets/contact/contact-envelope-open-base.png';
import contactEnvelopeOpenFront from '../assets/contact/contact-envelope-open-front.png';
import contactLetter from '../assets/contact/contact-letter.png';
import dandelion01 from '../assets/contact/dandelion-01.png';
import dandelion02 from '../assets/contact/dandelion-02.png';
import dandelion03 from '../assets/contact/dandelion-03.png';
import dandelion04 from '../assets/contact/dandelion-04.png';
import dandelion05 from '../assets/contact/dandelion-05.png';

export const VISUAL_ASSET_MANIFEST = {
  works: WORKS_SCENE_IMAGES,
  photoFrameOpen: [photoFrameOpen],
  product: [productNotebookOpen],
  content: [facai, joyceAi, liubai],
  ai: [aiVideo01, aiVideo02, aiVideo03, aiVideo04, aiVideo05],
  film: [yuwang, mujianMuji, dragonSeeker, workInProgress],
  aboutScene: [
    aboutWoodBackground,
    aboutLamp,
    aboutLightOverlay,
    aboutSwitchLamp,
    folderClosed,
  ],
  aboutOpenFolder: [
    folderOpen,
    photo,
    capabilityTicket,
    thingsILike,
    quotePaper,
    internship,
    welcomeTag,
    contactMailbox,
  ],
  contact: [
    contactBackground,
    contactMailboxMain,
    contactEnvelopeClosed,
    contactEnvelopeOpenBack,
    contactEnvelopeOpenBase,
    contactEnvelopeOpenFront,
    contactLetter,
    dandelion01,
    dandelion02,
    dandelion03,
    dandelion04,
    dandelion05,
  ],
};

export const IDLE_PRELOAD_ORDER = ['photoFrameOpen', 'aboutScene', 'aboutOpenFolder', 'product', 'content', 'ai', 'film', 'contact'];
