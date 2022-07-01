// Copyright 2018-2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import memoizee from 'memoizee';
import { instance, PhoneNumberFormat } from '../util/libphonenumberInstance';

function _format(
  phoneNumber: string,
  options: {
    ourRegionCode?: string;
  }
) {
  try {
    const { ourRegionCode } = options;
    const parsedNumber = instance.parse(phoneNumber);
    const regionCode = instance.getRegionCodeForNumber(parsedNumber);

    if (ourRegionCode && regionCode === ourRegionCode) {
      return instance.format(parsedNumber, PhoneNumberFormat.NATIONAL);
    }

    return instance.format(parsedNumber, PhoneNumberFormat.INTERNATIONAL);
  } catch (error) {
    return phoneNumber;
  }
}

export function isValidNumber(
  _phoneNumber: string,
  _options?: {
    regionCode?: string;
  }
): boolean {
  return true;
  // const { regionCode } = options || { regionCode: undefined };
  // try {
  //   const parsedNumber = instance.parse(phoneNumber, regionCode);

  //   return instance.isValidNumber(parsedNumber);
  // } catch (error) {
  //   return false;
  // }
}

export const format = memoizee(_format, {
  primitive: true,
  // Convert the arguments to a unique string, required for primitive mode.
  normalizer: (...args) => JSON.stringify(args),
  max: 5000,
});

export function parse(
  phoneNumber: string,
  options: {
    regionCode: string;
  }
): string {
  const { regionCode } = options;
  const parsedNumber = instance.parse(phoneNumber, regionCode);

  // if (instance.isValidNumber(parsedNumber)) {
  //   return instance.format(parsedNumber, PhoneNumberFormat.E164);
  // }

  // return phoneNumber;
  return instance.format(parsedNumber, PhoneNumberFormat.E164);
}

export function normalize(
  phoneNumber: string,
  options: { regionCode: string }
): string | undefined {
  const { regionCode } = options;
  try {
    const parsedNumber = instance.parse(phoneNumber, regionCode);

    // if (instance.isValidNumber(parsedNumber)) {
    //   return instance.format(parsedNumber, PhoneNumberFormat.E164);
    // }

    // return undefined;
    return instance.format(parsedNumber, PhoneNumberFormat.E164);
  } catch (error) {
    return undefined;
  }
}
