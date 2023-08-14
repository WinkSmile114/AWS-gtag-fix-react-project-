import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { parse } from 'uuid';
import PayroInput from '../PayroInput';
import './index.css';

interface NumbersGroupProps {
  amountOfInputs: number;
  onChangeFunction?: Function;
  isSocialSecurity?: boolean;
  originalVal?: string;
  onBlurFunction?: Function;
  customKeyPrefix?: string;
}

const FiniteNumbersGroupComponent = ({
  amountOfInputs,
  onChangeFunction,
  isSocialSecurity,
  originalVal,
  onBlurFunction,
  customKeyPrefix,
}: NumbersGroupProps) => {
  const [inputNumberFocused, setInputNumberFocused] = useState<
    number | null
  >();
  const [currentTotalVal, setCurrentTotalVal] = useState<
    string | undefined
  >(originalVal);
  const inputEls = useRef<any>(null);
  const theValString = currentTotalVal ?? '';
  const previousTotalVal = useRef<string | undefined>();

  useEffect(() => {
    if (!previousTotalVal.current) {
      previousTotalVal.current = currentTotalVal;
      return;
    }
    if (previousTotalVal.current == currentTotalVal) {
      return;
    }

    previousTotalVal.current = currentTotalVal;
    if (!onChangeFunction) {
      return;
    }
    if (!currentTotalVal) {
      return;
    }
    if (currentTotalVal.length == amountOfInputs) {
      console.log('alright Im gonna change it up now');
      onChangeFunction(currentTotalVal);
    }
  }, [currentTotalVal]);

  console.log('inputNumberFocused', inputNumberFocused);
  const keyPrefix = customKeyPrefix
    ? customKeyPrefix
    : Math.random().toString();
  let inputs = [];
  for (let i = 0; i < amountOfInputs; i++) {
    let valAtIndexI =
      theValString.length > i ? theValString[i] : undefined;
    // console.log('my input value at', i, valAtIndexI)
    inputs.push(
      <PayroInput
        usePropsValueInsteadOfState={true}
        key={`${keyPrefix}-${i}`}
        value={valAtIndexI}
        onFocus={() => setInputNumberFocused(i)}
        onBlurFunction={(e) => {}}
        forceFocus={i == inputNumberFocused}
        type="number"
        isFiniteNumberInput={true}
        isSocialSecurity={isSocialSecurity}
        wrapperAdditionalClasses="social-security"
        onBackspaceOfEmptyInput={() => {
          setInputNumberFocused(
            inputNumberFocused ? inputNumberFocused - 1 : 0,
          );
        }}
        triggerGoToNextFiniteNumberInput={() => {
          if (
            inputNumberFocused == 0 ||
            (inputNumberFocused &&
              inputNumberFocused < amountOfInputs - 1)
          ) {
            setInputNumberFocused(inputNumberFocused + 1);
          }
        }}
        onKeyDown={(e) => {
          console.log('keydown', e.key);
          // if (e.key == "Backspace") {
          //     console.log('valstring from in keydown', theValString)
          //     const pressedBackspaceOnEmptyInput = (theValString && theValString.length <= i)
          //     if (pressedBackspaceOnEmptyInput) {
          //         console.log('pressed backspace on empty input')
          //         if (i == 0) {
          //             return
          //         }

          //         const getValWithPreviousValDeleted = () => {

          //             let newVal = theValString.split('')
          //             newVal[i - 1] = ''
          //             let filteredVal = newVal.filter(e => {
          //                 if (e && e.length > 0) {
          //                     return true
          //                 }
          //             })
          //             .join('')
          //             return parseInt(filteredVal)
          //         }
          //         setCurrentTotalVal(getValWithPreviousValDeleted())
          //         setInputNumberFocused(inputNumberFocused ? inputNumberFocused - 1: 0)

          //     }
          // }
        }}
        onChange={(e) => {
          //whenever there is a change at the index, to string each part, filter nulls, and join and then parse int to get new num
          console.log(
            'theValString from onchange: ',
            theValString,
            'e: ',
            e,
          );

          let totalValArray = theValString.split('');
          totalValArray[i] = e ?? '';
          const newValString = totalValArray.join('');

          //const enteredANumber = totalValArray[i].length > 1
          if (onChangeFunction) {
            setCurrentTotalVal(newValString);
            if (!inputNumberFocused && inputNumberFocused !== 0) {
              return;
            }
            //onChangeFunction(newValString)
            if (
              e &&
              e.length > 0 &&
              inputNumberFocused < amountOfInputs - 1
            ) {
              setInputNumberFocused(
                inputNumberFocused || inputNumberFocused == 0
                  ? inputNumberFocused + 1
                  : 0,
              );
            }
          }
          // if (enteredANumber) {
          //    // setInputNumberFocused(i + 1)
          // }

          // let validatedE = e
          // if (validatedE.length > 1) {
          //     validatedE = e[0]
          // }

          // let totalValArray = theValString?.split('')
          // if (validatedE.length < 1) {
          //     totalValArray[i] = undefined
          // } else {
          //     let intVal = parseInt(validatedE)
          //     if (!isNaN(intVal)) {
          //         totalValCopy[i] = intVal
          //         if (i < amountOfInputs - 1) {
          //             setInputNumberFocused(inputNumberFocused + 1)
          //         }
          //     }
          // }
          // setTotalVal(totalValCopy)
          // console.log('the wonderful', e)
          //console.log(totalVal)
        }}
      ></PayroInput>,
    );
  }

  if (isSocialSecurity) {
    const dashDiv1 = (
      <div className="ss-divider" key={`${keyPrefix}-divider1`}></div>
    );
    const dashDiv2 = (
      <div className="ss-divider" key={`${keyPrefix}-divider2`}></div>
    );
    inputs.splice(3, 0, dashDiv1);
    inputs.splice(6, 0, dashDiv2);
  }

  inputEls.current = inputs;
  return (
    <form
      onSubmit={(e) => {
        e?.preventDefault();
      }}
    >
      <div
        onKeyDown={(e) => {
          //console.log('the key from div', e.key)
          // switch(e.key) {
          //     case 'ArrowLeft':
          //         setInputNumberFocused(!inputNumberFocused? 0 : inputNumberFocused - 1)
          //         break;
          //     case 'ArrowRight':
          //         if (inputNumberFocused !== 0 && !inputNumberFocused) {
          //             return
          //         }
          //         if (inputNumberFocused >= amountOfInputs - 1) {
          //             return
          //         }
          //         setInputNumberFocused(inputNumberFocused + 1)
          //         break;
          // }
        }}
        onBlur={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (onBlurFunction) {
          }
        }}
        className={
          'single-val-inputs-group' +
          (isSocialSecurity ? ' social-security-group' : '')
        }
      >
        {inputs}
      </div>
    </form>
  );
};

export default React.memo(FiniteNumbersGroupComponent);
