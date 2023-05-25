import React, { useState } from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { isValidUrl } from 'utils';
import SimpleLoadButton from "components/SimpleLoadButton";
import { toast } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import axiosHttp from 'api';

export default ({ title, desc, link, spaceDomain, accessControl, okButton, onNotionCheckStatus, ...props }) => {
    const [linkLoading, setLinkLoading] = useState(false)

    const handleAddResource = async () => {
        if (title === '') {
            return toast.error("Please enter title");
        }
        else if (link === '') {
            return toast.error("Please enter link");
        }
        else if (!isValidUrl(link)) {
            return toast.error("Please enter a valid link");
        }
        else if (!spaceDomain) {
            return toast.error("Valid notion domain required");
        }
        else {
            if (accessControl) {
                setLinkLoading(true)
                axiosHttp.get(`/project/notion/space-admin-status?domain=${spaceDomain}`)
                    .then(res => {
                        onNotionCheckStatus(res.data)
                    })
                    .catch(e => {
                        onNotionCheckStatus({ status: false, message: 'Something went wrong. Try again' })
                    })
                    .finally(() => setLinkLoading(false))
            } else {
                onNotionCheckStatus({ status: true })
            }
        }
    }

    return (
        <>
            {
                okButton ?
                    <SimpleLoadButton
                        disabled={linkLoading}
                        title="OK"
                        bgColor={link !== '' && title !== '' && !linkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0.2)'}
                        className="button"
                        fontsize={16}
                        fontweight={400}
                        height={40}
                        width={129}
                        onClick={() => handleAddResource()}
                    />
                    :
                    <button
                        disabled={link === '' || title === '' || linkLoading}
                        style={{ background: link !== '' && title !== '' && !linkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0.2)', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleAddResource()}
                    >   {
                            <AiOutlinePlus color="#FFF" size={25} />
                        }
                    </button>
            }
        </>

    )
}