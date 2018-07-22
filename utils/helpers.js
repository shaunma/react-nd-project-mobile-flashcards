import React from 'react'
import {AsyncStorage} from 'react-native'
import {Notifications, Permissions} from 'expo'

const NOTIFICATION_KEY = 'FLASH_CARDS_NOTIFICATIONS'

// Clear the next notification and reschedule.
export function clearLocalNotification() {
  return AsyncStorage.removeItem(NOTIFICATION_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}

function createNotification() {
  return {
    title: 'Review your flash cards!',
    body: "Don't forget to take your quizzes today.",
    ios: {
      sound: false,
    },
    android: {
      sound: false,
      priority: 'high',
      sticky: false,
      vibrate: true,
    }
  }
}

// Set quiz notification for 9 am daily.
export function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS)
          .then(({status}) => {
            if (status === 'granted') {
              Notifications.cancelAllScheduledNotificationsAsync()

              let tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              tomorrow.setHours(9)
              tomorrow.setMinutes(0)
              Notifications.scheduleLocalNotificationAsync(
                createNotification(),
                {
                  time: tomorrow,
                  repeat: 'day',
                }
              )

              AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true))
            }
          })
      }
    })
}
