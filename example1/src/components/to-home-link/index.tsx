import Chip from '@mui/material/Chip';
import { createStyles, makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles'

import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import React, { ReactChild, ReactElement } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wrp: {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: theme.spacing(8),
        },
        link: {
            display: 'block',
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(2),
            textDecoration: 'none',
            color: theme.palette.primary.main,
        },
        icon: {
            marginRight: theme.spacing(1),
            width: 20,
            height: 20,
        },
    }),
);

interface IProps {
    children?: ReactChild;
}

const ToHomeLink = ({ children }: IProps): ReactElement => {
    const styles = useStyles();

    return (
        <div className={styles.wrp}>
            <Link href="/" className={styles.link}>

                <Chip label="back to home page" icon={<HomeIcon />} clickable />

            </Link>
            {children}
        </div>
    );
};

export default ToHomeLink;
