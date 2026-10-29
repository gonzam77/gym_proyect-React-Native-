// Modulo nativo PantallaEncendida (iOS).
//
// Equivalente al de Android (PantallaEncendidaModule.kt): durante el descanso y
// la serie en curso el telefono queda apoyado mostrando el contador, y sin esto
// iOS apaga la pantalla segun el bloqueo automatico del usuario.
// idleTimerDisabled solo afecta mientras la app esta en primer plano, asi que
// no puede quedar "colgado" gastando bateria con la app cerrada.

#import <React/RCTBridgeModule.h>
#import <UIKit/UIKit.h>

@interface PantallaEncendida : NSObject <RCTBridgeModule>
@end

@implementation PantallaEncendida

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

// UIApplication solo se puede tocar desde el hilo principal.
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(activar)
{
  [UIApplication sharedApplication].idleTimerDisabled = YES;
}

RCT_EXPORT_METHOD(desactivar)
{
  [UIApplication sharedApplication].idleTimerDisabled = NO;
}

@end
