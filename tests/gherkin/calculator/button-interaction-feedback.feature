Feature: Calculator button interaction feedback (SCRUM-18)
  As a user
  I want calculator buttons to provide clear hover, pressed, and focus-visible feedback
  So that the UI feels responsive and accessible

  Background:
    Given I open the calculator app

  Scenario: Buttons are keyboard focusable and show a visible focus indicator
    When I press the Tab key until the "C" button is focused
    Then the "C" button should have a visible focus indicator

  Scenario: Pressing a number button updates the display
    When I click the "7" button
    Then the display should show "7"

  Scenario: Pressing equals computes the operation result
    When I click the "7" button
    And I click the "+" button
    And I click the "8" button
    And I click the "=" button
    Then the display should show "15"

  Scenario: Pressed state styling exists for buttons
    Then the stylesheet should define pressed styling for "button:active"

  Scenario: Focus-visible styling exists for buttons
    Then the stylesheet should define focus-visible styling for "button:focus-visible"
