import {LocalStorage} from 'quasar'

const isClientUsingTor = () => window.location.hostname.endsWith('.onion')

const Policy = {
    RW: {read: true, write: true},
    RO: {read: true, write: false},
    WO: {read: false, write: true},
}

const getMainnetRelays = (extra = 3) => {
  const relays = {
    'wss://relay.rants.pub': Policy.RW,
  }

  const optional = [
    ['wss://nostr-pub.wellorder.net', Policy.RW],
    ['wss://nostr-verified.wellorder.net', Policy.RO],
    ['wss://expensive-relay.fiatjaf.com', Policy.RO],
    ['wss://nostr-sandbox.minds.io/nostr/v1/ws', Policy.RO],
    ['wss://nostr.rocks', Policy.RW],
    ['wss://relay.damus.io', Policy.RW],
    ['wss://nostr.onsats.org', Policy.RW],
    ['wss://nostr-relay.untethr.me', Policy.RW],
    ['wss://nostr-relay.wlvs.space', Policy.RW],
    ['wss://nostr.bitcoiner.social', Policy.RW],
    ['wss://nostr.openchain.fr', Policy.RW],
    ['wss://nostr.drss.io', Policy.RW],
    ['wss://nostr.rocks', {read: true, write: true}],
    ['wss://relay.damus.io', {read: true, write: true}],
    ['wss://nostr.onsats.org', {read: true, write: true}],
    ['wss://nostr-relay.untethr.me	', {read: true, write: true}],
    ['wss://nostr-relay.wlvs.space', {read: true, write: true}],
    ['wss://nostr.bitcoiner.social', {read: true, write: true}],
    ['wss://nostr.openchain.fr', {read: true, write: true}],
    ['wss://nostr.drss.io', {read: true, write: true}]
  ]

  for (let i = 0; i < Math.min(extra, optional.length); i++) {
    let pick = parseInt(Math.random() * optional.length)
    let [url, prefs] = optional[pick]
    relays[url] = prefs
    optional.splice(pick, 1)
  }

  return relays
}

const getTorRelays = () => ({
  'ws://jgqaglhautb4k6e6i2g34jakxiemqp6z4wynlirltuukgkft2xuglmqd.onion': {
    read: true,
    write: true
  }
})

export default function () {
  const relays = isClientUsingTor() ? getTorRelays() : getMainnetRelays(0)

  return {
    keys: LocalStorage.getItem('keys') || {}, // {priv, pub }

    relays, // { [url]: {} }
    following: [], // [ pubkeys... ]

    profilesCache: {}, // { [pubkey]: {name, about, picture, ...} }
    profilesCacheLRU: [], // [ pubkeys... ]
    contactListCache: {}, // { [pubkey]: {name, about, picture, ...} }
    contactListCacheLRU: [], // [ pubkeys... ]
    nip05VerificationCache: {}, // { [identifier]: {pubkey, when }

    lastNotificationRead: LocalStorage.getItem('lastNotificationRead') || 0,
    unreadNotifications: 0
  }
}
