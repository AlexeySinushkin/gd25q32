//менеджер заслонки
#include "stm32f10x.h"
#include "FreeRTOS.h"
#include "task.h"

#include "ShutterManager.h"
#include "stm32f10x_tim.h"
#include "common.h"

// Конфигурация выхода таймера
TIM_OCInitTypeDef TIM_OCConfig;
// Конфигурация порта
GPIO_InitTypeDef GPIO_Config;

bool makeChange=FALSE;

void SetShutter(u16 deg){
    TIM_OCConfig.TIM_Pulse = deg;  
    // Инициализируем TIM2_CH2 выход таймера №2
    TIM_OC2Init(TIM2, &TIM_OCConfig);
    makeChange=TRUE;    
}
void vTaskShutterManager(void *pvParameters) {

    // Пин1
    GPIO_Config.GPIO_Pin = GPIO_Pin_1;
    // Альтернативная функция (в нашем случае - выход таймера), Push-Pull
    GPIO_Config.GPIO_Mode = GPIO_Mode_AF_PP;
    // Частота - 50 MHz
    GPIO_Config.GPIO_Speed = GPIO_Speed_50MHz;
    // Инициализируем порт A этой конфигурацией
    GPIO_Init(GPIOA, &GPIO_Config);

    // Пин2
    GPIO_Config.GPIO_Pin = GPIO_Pin_2;
    // Либо 0 либо HiZ
    GPIO_Config.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_Init(GPIOA, &GPIO_Config);
    GPIOA->BRR=GPIO_Pin_2;
    
    // Конфигурация таймера
    TIM_TimeBaseInitTypeDef TIM_BaseConfig;

    //При 50 импульсах в секунду рабочий промежуток составляет 20мс
    //Разбег для регулирования от 1мс до 2мс составляет 1мс
    //одну миллисекунду надо поделить на 180 (200) градусов
    //следовательно минимальная единица времени 1мс/200 - 5мкс
    //требуемая частота 200ударов*20рабочих промежутоков*50импульсов в секунду = 200кГц 
    // Запускаем таймер на тактовой частоте в 200 kHz
    TIM_BaseConfig.TIM_Prescaler = (uint16_t) (SystemCoreClock / 200000) - 1;
    // TOP - 200*20
    TIM_BaseConfig.TIM_Period = 20*200;
    TIM_BaseConfig.TIM_ClockDivision = 0;
    // Отсчет от нуля до TIM_Period
    TIM_BaseConfig.TIM_CounterMode = TIM_CounterMode_Up;

    // Инициализируем таймер №2 (его выходы как раз на порту A)
    TIM_TimeBaseInit(TIM2, &TIM_BaseConfig);

    // Конфигурируем выход таймера, режим - PWM1
    TIM_OCConfig.TIM_OCMode = TIM_OCMode_PWM1;
    // Собственно - выход включен
    TIM_OCConfig.TIM_OutputState = TIM_OutputState_Enable;
    // Пульс длинной 90
    TIM_OCConfig.TIM_Pulse = Shut_Min;
    // Полярность => пульс - это единица (+3.3V)
    TIM_OCConfig.TIM_OCPolarity = TIM_OCPolarity_High;

    // Инициализируем TIM2_CH2 выход таймера №2
    TIM_OC2Init(TIM2, &TIM_OCConfig);

    
    // Как я понял - автоматическая перезарядка таймера, если неправ - поправте.
    TIM_OC2PreloadConfig(TIM2, TIM_OCPreload_Enable);
    TIM_ARRPreloadConfig(TIM2, ENABLE);


  
   for(;;){
    vTaskDelay(100);    
    if (makeChange==TRUE){
      // Включаем таймер
      TIM_Cmd(TIM2, ENABLE);
      GPIOA->BSRR=GPIO_Pin_2;
      vTaskDelay(1000);
      GPIOA->BRR=GPIO_Pin_2;
      // Выключаем таймер
      TIM_Cmd(TIM2, DISABLE);
      makeChange=FALSE;
    }
  }
}

    /*if (plus==TRUE)
    {
      i+=10;
      if (i==Shut_Max)plus=FALSE;
    }
    if (plus==FALSE)
    {
      i-=10;
      if (i==Shut_Min)plus=TRUE;
    }*/