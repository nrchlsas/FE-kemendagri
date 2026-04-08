import { Fragment, React, useEffect, useState } from 'react';

const FormSelectFilter = ({ onSelect, selected, onSearch, dataList = [], placeholder = "- Pilih Data -" }) => {

    const [open, setOpen] = useState(false);

    useEffect(() => {
    }, [selected])

    function toogle() {
        setOpen(!open);
    }

    function changeText(e) {
        if (e.key == 'Enter') {
            onSearch(e.target.value);
            e.preventDefault();
            return false;
        }
    }

    function onSelectedItem(item) {
        if (onSelect) onSelect(item);
        setOpen(false);
    }

    function clearSelected() {
        if (onSelect) onSelect(null);
    }

    return (
        <Fragment>
            <div className='form-select-filter'>
                <div onClick={toogle}>
                    {selected ? selected.text : placeholder}
                    {open ? <span className='close-button'>Close</span> : null}
                </div>
                {open ? (
                    <>
                        <div className='popup-menu'>
                            <div className='d-flex flex-row justify-content-between align-items-center'>
                                <input type='text' placeholder='searching keyword' onKeyDown={changeText}></input>
                                {selected ? (<div style={{ width: '200px', color: 'cornflowerblue' }} onClick={clearSelected} className='cursor-pointer'>Delete Selected Data</div>) : null}
                            </div>
                            {
                                dataList.length ?
                                    <ul>
                                        {dataList.map(item => (
                                            <li key={'select_option_filter_' + item.id} value={item.id} onClick={() => onSelectedItem(item)} className='cursor-pointer'>
                                                {item.text}
                                            </li>
                                        ))}
                                    </ul> : null
                            }
                        </div>
                    </>
                ) : null}
            </div>
        </Fragment>
    )
}

export default FormSelectFilter;