import { Observer, Subject, Observable } from 'rxjs';
import { onShutDown } from 'server/shut-down';
type Bus = Observer<BusMessage> & Observable<BusMessage>;
export const localBus = new Subject<BusMessage>() as Bus;
onShutDown( async () => {
	localBus.complete();
} );
