package com.movieapp

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "MovieApp"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    // 🔥 Enable autoplay for all WebViews in your app
    try {
      val webView = WebView(this)
      val settings: WebSettings = webView.settings
      settings.javaScriptEnabled = true
      settings.mediaPlaybackRequiresUserGesture = false // IMPORTANT
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
