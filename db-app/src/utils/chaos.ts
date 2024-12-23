import { setTimeout } from 'timers/promises';
import {Response } from 'express';

/**
 * Randomly throw error and slow response
 */
async function chaos(res: Response): Promise<void> {
    const codes = [400, 401, 403, 404, 409, 500];
    const rand = Math.floor(Math.random() * 500);
  
    if (rand < 450) {
      const pause = Math.floor(Math.random() * 500);
      return setTimeout(pause);
    }
    res.statusCode = codes[Math.floor(Math.random() * codes.length)];
    throw new Error('BOOM !');
}

export default chaos