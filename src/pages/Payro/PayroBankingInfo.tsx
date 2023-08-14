import './PayroBankingInfo.scss';
import additionalUsersIconPurple from '../../common-icons/side-bar-additional-users-purple.svg';
import copyIcon from '../../common-icons/copy-icon.svg';
import { useState,useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import Loader from '../../widgets/Loader';
import TitleSection from '../../Header/title-section';


function PayroBankingInfo (){
    const [BankingInfo,setBankingInfo] = useState([]);
    useEffect(() => {
        axios
        .get(`${process.env.REACT_APP_API}/accounts/banking-info`)
        .then((res) => {
            console.log('loggging here')
            if(res.data && res.data.bankingInfo)
                setBankingInfo(res.data.bankingInfo);
        });
    },[]);

    return (
        !BankingInfo
        ?   
            <Loader />
        :
            <>
                <div id="settings-main-container">
                    <div className='settings-home-container-info'>
                        <TitleSection
                        centered={true}
                            title="Banking Info"
                            subtitle="To wire a payment please use the wire instruction below. Please note that it may take up to 2 business days for the payment to reflect on your account online."
                        />
                        <div className='settings-options-home-container'>
                            {
                                BankingInfo.map((info) => {
                                    if(info == ''){
                                        return (<br/>);
                                    }else{
                                        return (<p>{info}</p>)
                                    }
                                })
                            }
                            <br/>
                        </div>
                    </div>
                </div>
            </>
    )
}

export default PayroBankingInfo