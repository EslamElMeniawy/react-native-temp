import {
  describe,
  expect,
  it,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import notifee from '@notifee/react-native';
import { renderHook } from '@testing-library/react-native';

import { useNotificationsChannels } from '@src/App/useNotificationsChannels';
import { translate } from '@modules/localization';
import { defaultChannelId, localChannelId } from '@modules/utils';

jest.mock('@notifee/react-native');
jest.mock('@modules/localization', () => ({
  translate: jest.fn(),
}));

const setupMocks = () => {
  jest.clearAllMocks();
  (notifee.createChannel as any).mockResolvedValue('channel-id');
  (translate as any).mockReturnValue('Test App');
  jest.spyOn(console, 'info').mockImplementation(() => {});
};

const teardownMocks = () => {
  (console.info as any).mockRestore();
};

describe('useNotificationsChannels - Hook Calls', () => {
  beforeEach(setupMocks);
  afterEach(teardownMocks);

  it('should call createChannel twice on mount', () => {
    renderHook(() => useNotificationsChannels());

    expect(notifee.createChannel).toHaveBeenCalledTimes(2);
  });

  it('should create default notification channel', () => {
    renderHook(() => useNotificationsChannels());

    expect(notifee.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        id: defaultChannelId,
      }),
    );
  });

  it('should create local notification channel', () => {
    renderHook(() => useNotificationsChannels());

    expect(notifee.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        id: localChannelId,
      }),
    );
  });
});

describe('useNotificationsChannels - Channel Configuration', () => {
  beforeEach(setupMocks);
  afterEach(teardownMocks);

  it('should set channel name from translation', () => {
    renderHook(() => useNotificationsChannels());

    expect(notifee.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Test App',
      }),
    );
  });

  it('should set default sound for channels', () => {
    renderHook(() => useNotificationsChannels());

    expect(notifee.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        sound: 'default',
      }),
    );
  });

  it('should call translate for app name', () => {
    renderHook(() => useNotificationsChannels());

    expect(translate).toHaveBeenCalledWith('appName');
  });
});

describe('useNotificationsChannels - Channel Order', () => {
  beforeEach(setupMocks);
  afterEach(teardownMocks);

  it('should handle channels creation in correct order', () => {
    renderHook(() => useNotificationsChannels());

    const calls = (notifee.createChannel as any).mock.calls;
    expect((calls[0] as any)[0]).toEqual(
      expect.objectContaining({ id: defaultChannelId }),
    );
    expect((calls[1] as any)[0]).toEqual(
      expect.objectContaining({ id: localChannelId }),
    );
  });

  it('should log channel creation info', () => {
    const logSpy = jest.spyOn(console, 'info');
    renderHook(() => useNotificationsChannels());

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('createNotificationsChannels'),
    );
  });
});

describe('useNotificationsChannels - Promise Handling', () => {
  beforeEach(setupMocks);
  afterEach(teardownMocks);

  it('should handle promise resolution from createChannel', async () => {
    (notifee.createChannel as any).mockResolvedValue('test-channel');

    const { result } = renderHook(() => useNotificationsChannels());
    expect(result.current).toBeUndefined();

    await new Promise(resolve => setTimeout(resolve, 0));
  });

  it('should create channels with correct parameters', () => {
    renderHook(() => useNotificationsChannels());

    const calls = (notifee.createChannel as any).mock.calls;
    expect(calls.length).toBe(2);
    expect((calls[0] as any)[0]).toEqual({
      id: defaultChannelId,
      name: 'Test App',
      sound: 'default',
    });
  });
});

describe('useNotificationsChannels - Edge Cases', () => {
  beforeEach(setupMocks);
  afterEach(teardownMocks);

  it('should use empty string when translation returns undefined', () => {
    (translate as any).mockReturnValue(undefined);
    renderHook(() => useNotificationsChannels());

    expect(notifee.createChannel).toHaveBeenCalledWith(
      expect.objectContaining({
        name: '',
      }),
    );
  });
});
