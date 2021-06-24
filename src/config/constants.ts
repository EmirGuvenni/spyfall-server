/**
 * Avatar map
 */
// Avatar code to url look up table
// Key: avatar code
// Value: Bucket URL of the avatar image
// Images should be contained in Firebases bucket
export const avatarsMap: Map<string, string> = new Map();

// Set avatart code - URL pairs
avatarsMap.set('', '');

/**
 * Language array
 */
export const LANGUAGES: string[] = ['tr', 'en'];

/**
 * Feedback variables
 */
export const FEEDBACK_MAX_NAME_LENGTH: number = 16;
export const FEEDBACK_MAX_EMAIL_LENGTH: number = 64;
export const FEEDBACK_MIN_MESSAGE_LENGTH: number = 50;
export const FEEDBACK_MAX_MESSAGE_LENGTH: number = 1024;
export const FEEDBACK_TYPES: string[] = ['Bug', 'Enhancement', 'Opinion', 'Other'];

/**
 * Server variables
 */
export const RATE_LIMIT_TIME_MS: number = 1000;
export const RATE_LIMIT: number = 4;
export const NUMBER_OF_ROOMS_TO_SEND: number = 20; // Number of rooms to send when a player requests the /rooms path or scrolls to the bottom

/**
 * Discord Webhook variables
 */
export const DISCORD_EMBED_COLOR: number = 10092475;
export const DISCORD_AVATAR_URL: string = '';

/**
 * Site variables
 */
export const DOMAIN_NAME: string = '';
export const WEBSITE_URL: string = 'https://';

/**
 * Room variables
 */
export const ROOM_ID_LENGTH: number = 6;
export const MAX_ROOM_NAME_LENGTH: number = 32;

export const MIN_TIMER_LIMIT: number = 60;
export const MAX_TIMER_LIMIT: number = 3600;

export const MAX_PLAYER_LIMIT: number = 16;
export const MIN_PLAYER_LIMIT: number = 4;

export const MAX_SPY_LIMIT: number = 4;

/**
 * Question variables
 */
export const MAX_QUESTION_LENGTH: number = 384;
export const MIN_QUESTION_LENGTH: number = 8;
export const MAX_ANSWER_LENGTH: number = 256;

/**
 * Password variables
 */
export const MAX_PASSWORD_LENGTH: number = 32;

/**
 * User variables
 */
export const MIN_USERNAME_LENGTH: number = 2;
export const MAX_USERNAME_LENGTH: number = 16;
export const USER_ID_LENGTH: number = 24;

/**
 * Location variables
 */
export const MAX_LOCATION_LIMIT: number = 10;
export const MIN_LOCATION_LIMIT: number = 4;
export const MAX_LOCATION_NAME_LENGTH: number = 32;

// Role variables
export const MAX_ROLE_LIMIT: number = 12;
export const MIN_ROLE_LIMIT: number = 4
export const MAX_ROLE_NAME_LENGTH: number = 24;