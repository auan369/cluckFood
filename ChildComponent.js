// ChildComponent.js
import React from 'react';
import { View, Button } from 'react-native';

function ChildComponent({ onCompleteOnboarding }) {
  const handleOnboardingComplete = () => {
    // Call the parent's function to complete onboarding
    onCompleteOnboarding();
  };

  return (
    <View>
      <Button
        title="Complete Onboarding"
        onPress={handleOnboardingComplete}
      />
    </View>
  );
}

export default ChildComponent;
