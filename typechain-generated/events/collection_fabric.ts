import type * as EventTypes from '../event-types/collection_fabric';
import type {ContractPromise} from "@polkadot/api-contract";
import type {ApiPromise} from "@polkadot/api";
import EVENT_DATA_TYPE_DESCRIPTIONS from '../event-data/collection_fabric.json';
import {getEventTypeDescription} from "../shared/utils";
import {handleEventReturn} from "@archisinal/typechain-types";

export default class EventsClass {
	readonly __nativeContract : ContractPromise;
	readonly __api : ApiPromise;

	constructor(
		nativeContract : ContractPromise,
		api : ApiPromise,
	) {
		this.__nativeContract = nativeContract;
		this.__api = api;
	}

	public subscribeOnAdminAddedEvent(callback : (event : EventTypes.AdminAdded) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('AdminAdded', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.AdminAdded);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'AdminAdded');
	}

	public subscribeOnAdminRemovedEvent(callback : (event : EventTypes.AdminRemoved) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('AdminRemoved', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.AdminRemoved);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'AdminRemoved');
	}

	public subscribeOnCollectionInstantiatedEvent(callback : (event : EventTypes.CollectionInstantiated) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('CollectionInstantiated', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.CollectionInstantiated);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'CollectionInstantiated');
	}

	public subscribeOnCollectionBannedEvent(callback : (event : EventTypes.CollectionBanned) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('CollectionBanned', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.CollectionBanned);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'CollectionBanned');
	}

	public subscribeOnCollectionUnbannedEvent(callback : (event : EventTypes.CollectionUnbanned) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('CollectionUnbanned', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.CollectionUnbanned);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'CollectionUnbanned');
	}

	public subscribeOnCodehashBannedEvent(callback : (event : EventTypes.CodehashBanned) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('CodehashBanned', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.CodehashBanned);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'CodehashBanned');
	}

	public subscribeOnCodehashUnbannedEvent(callback : (event : EventTypes.CodehashUnbanned) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('CodehashUnbanned', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.CodehashUnbanned);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'CodehashUnbanned');
	}

	public subscribeOnCollectionWhiteListedEvent(callback : (event : EventTypes.CollectionWhiteListed) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('CollectionWhiteListed', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.CollectionWhiteListed);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'CollectionWhiteListed');
	}

	public subscribeOnCollectionUnWhiteListedEvent(callback : (event : EventTypes.CollectionUnWhiteListed) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('CollectionUnWhiteListed', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.CollectionUnWhiteListed);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'CollectionUnWhiteListed');
	}

	public subscribeOnWhitelistEnabledEvent(callback : (event : EventTypes.WhitelistEnabled) => void) {
		const callbackWrapper = (args: any[], event: any) => {
			const _event: Record < string, any > = {};

			for (let i = 0; i < args.length; i++) {
				_event[event.args[i]!.name] = args[i]!.toJSON();
			}

			callback(handleEventReturn(_event, getEventTypeDescription('WhitelistEnabled', EVENT_DATA_TYPE_DESCRIPTIONS)) as EventTypes.WhitelistEnabled);
		};

		return this.__subscribeOnEvent(callbackWrapper, (eventName : string) => eventName == 'WhitelistEnabled');
	}


	private __subscribeOnEvent(
		callback : (args: any[], event: any) => void,
		filter : (eventName: string) => boolean = () => true
	) {
		// @ts-ignore
		return this.__api.query.system.events((events) => {
			events.forEach((record: any) => {
				const { event } = record;

				if (event.method == 'ContractEmitted') {
					const [address] = record.event.data;

					if (address.toString() === this.__nativeContract.address.toString()) {
						const {args, event} = this.__nativeContract.abi.decodeEvent(record);

						if (filter(event.identifier.toString()))
							callback(args, event);
					}
				}
			});
		});
	}

}