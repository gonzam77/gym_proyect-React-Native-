package com.rutina360

import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Mantiene la pantalla encendida mientras corre el descanso o la serie.
 *
 * Se apoya en FLAG_KEEP_SCREEN_ON, que vive en la ventana de la Activity y no
 * en el proceso: si la Activity se destruye el flag se va con ella, asi que un
 * desmontaje mal hecho no puede dejar la pantalla prendida para siempre.
 *
 * No necesita ningun permiso en el manifest, a diferencia de un WakeLock.
 */
class PantallaEncendidaModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NOMBRE

  @ReactMethod
  fun activar() = cambiarFlag(true)

  @ReactMethod
  fun desactivar() = cambiarFlag(false)

  /**
   * El flag solo se puede tocar desde el hilo de UI y solo si hay una Activity
   * viva: con la app en segundo plano currentActivity es null y no hay ninguna
   * pantalla que mantener encendida, asi que no hacer nada es lo correcto.
   */
  private fun cambiarFlag(encendida: Boolean) {
    val activity = currentActivity ?: return
    activity.runOnUiThread {
      if (encendida) {
        activity.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
      } else {
        activity.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
      }
    }
  }

  companion object {
    const val NOMBRE = "PantallaEncendida"
  }
}
