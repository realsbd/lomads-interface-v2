import React from "react";
import { useAppSelector } from "helpers/useAppSelector";
import { find as _find, get as _get } from 'lodash';
import { useWeb3Auth } from "context/web3Auth";
import { useDAO } from "context/dao";

import assign from 'assets/svg/assign.svg'
import submitted from 'assets/svg/submitted.svg'
import applied from 'assets/svg/applied.svg'
import openSvg from 'assets/svg/open.svg'
import memberIcon from 'assets/svg/memberIcon.svg';
import editToken from 'assets/svg/editToken.svg';
import deleteIcon from 'assets/svg/deleteIcon.svg';
import compensationStar from 'assets/svg/compensationStar.svg';
import calendarIcon from 'assets/svg/calendar.svg'
import applicants from 'assets/svg/applicants.svg'
import folder from 'assets/svg/folder.svg'
import paid from 'assets/svg/paid.svg'
import approved from 'assets/svg/approved.svg'
import rejected from 'assets/svg/rejected.svg'
import iconSvg from 'assets/svg/createProject.svg';

const { toChecksumAddress } = require('ethereum-checksum-address')

export default () => {

    const { account } = useWeb3Auth()
    const { DAO } = useDAO();

    const amIApplicant = (task: any) => Boolean(_find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account)))

    const hasMySubmission = (task: any) => {
        const user = _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account))
        return user && user.submission
    }

    const isMySubmissionAccepted = (task: any) => {
        const user = _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account))
        return user && user.submission && user.status === 'submission_accepted'
    }

    const amIApproved = (task: any) =>
        _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account) && m.status === 'approved')

    const amIRejected = (task: any) =>
        _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account) && m.status === 'submission_rejected')

    const getRejectionNote = (task: any) => {
        const user = _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account))
        return user?.rejectionNote || null
    }

    const amIEligible = (task: any) => {
        const user = _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account))
        if (user) {
            let index = task?.validRoles.findIndex((item: any) => item.toLowerCase() === user?.role?.toLowerCase());
            return index > -1
        }
        return false
    }

    const amIEligibleDiscord = (task: any) => {
        const user = _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account))
        if (user) {
            let flag = false;
            if (user?.discordRoles) {
                task?.validRoles?.map((channelId: string) => {
                    Object.keys(user.discordRoles).forEach((key: any) => {
                        if (_get(user, `discordRoles.${key}`).includes(channelId)) {
                            flag = true
                        }
                    })
                })
                return flag
            }
        }
        return false
    }

    const amICreator = (task: any) => {
        const user = _find(_get(task, 'members', []), m => toChecksumAddress(_get(m, 'member.wallet', '')) === toChecksumAddress(account))
        return user?.member?._id === task?.reviewer?._id
    }

    const assignedUser = (task: any) => {
        return _find(_get(task, 'members', []), m => m.status === 'approved' || m.status === 'submission_accepted')
    }

    const taskMembers = (task: any) => {
        return _get(task, 'members', []).filter((m: any) => m.status !== 'rejected');
    }

    const applicationCount = (task: any) => {
        let applications = _get(task, 'members', []).filter((m: any) => (m.status !== 'rejected' && m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
        if (applications)
            return applications.length
        return 0
    };

    const submissionCount = (task: any) => {
        let submissions = _get(task, 'members', [])?.filter((m: any) => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
        if (submissions)
            return submissions.length
        return 0
    };

    const getTaskStatus = (task: any) => {
        /* If task was manually assigned---check if current user is approved applicant or other user*/
        if (task.taskStatus === 'submitted' && (task.contributionType === 'assign' || task.contributionType === 'open')) {
            if (amIApproved(task))
                return { status: 'Under review', color: '#6B99F7', icon: submitted }
            return { status: 'Submitted', color: '#6B99F7', icon: submitted }
        }
        /* If task was manually assigned---check if current user is approved applicant or other user*/
        else if (task.contributionType === 'assign' && task.taskStatus === 'assigned') {
            if (amIApproved(task))
                return { status: "Assigned to me", color: '#0EC1B0', icon: assign }
            else {
                if (amIRejected(task))
                    return { status: "Rejected", color: '#E23B53', icon: rejected }
                return { status: 'assigned', color: '#0EC1B0', icon: assign }
            }
        }
        // if task was open for all and task status is still open --- check if current user has applied or not
        else if (task.contributionType === 'open' && task.taskStatus === 'open' && task.reopenedAt === null) {
            if (hasMySubmission(task)) {
                if (amIRejected(task)) {
                    return { status: "Rejected", color: "#E23B53", icon: rejected }
                } else if (isMySubmissionAccepted(task)) {
                    return { status: "Approved", color: "#27C46E", icon: approved }
                } else {
                    return { status: "Under review", color: "#6B99F7", icon: submitted }
                }
            } else {
                if (amIApplicant(task))
                    return { status: "Applied", color: "#FFB600", icon: applied }
                return { status: "Open", color: "#4BA1DB", icon: openSvg }
            }
        }
        //if task was open for all and task has been assigned --- check if current user is approved or other
        else if (task.contributionType === 'open' && task.taskStatus === 'assigned' && task.reopenedAt === null) {
            if (amIApplicant(task)) {
                if (amIApproved(task))
                    return { status: "Assigned to me", color: "#0EC1B0", icon: assign }
            }
            return { status: "Assigned", color: "#0EC1B0", icon: assign }
        }

        else if (task.reopenedAt !== null) {
            if (amIApplicant(task)) {
                return { status: "Applied", color: "#FFB600", icon: applied }
            } else {
                if (amIRejected(task))
                    return { status: "Rejected", color: "#E23B53", icon: rejected }
                return { status: "Open", color: "#4BA1DB", icon: openSvg }
            }
        }

        else if (task.taskStatus === 'approved') {
            return { status: "Approved", color: "#27C46E", icon: approved }
        }

        else if (task.taskStatus === 'paid') {
            return { status: "Paid", color: "#74D415", icon: paid }
        }

        else if (task.taskStatus === 'rejected') {
            return { status: "Rejected", color: "#E23B53", icon: rejected }
        } else {
            return {}
        }
    }

    const getTaskBody = (task: any) => {
        if (task.taskStatus === 'open' && !task.archivedAt && !task.deletedAt) {
            if (amICreator(task)) {
                if (task.contributionType === 'open' && task.isSingleContributor == false) {
                    return { renderBody: 'SHOW_SUBMISSIONS' }
                }
                else {
                    return { renderBody: 'SHOW_APPLICATIONS' }
                }
            }
            else {
                if (amIApplicant(task)) {
                    if (amIRejected(task)) {
                        return { renderBody: 'SUBMISSION_REJECTED' }
                    }
                    else {
                        if (task.contributionType === 'open' && hasMySubmission(task)) {
                            if (isMySubmissionAccepted(task)) {
                                return { renderBody: 'WELL_DONE' }
                            }
                            else {
                                return { renderBody: 'WAITING_FOR_VALIDATION' }
                            }
                        }
                        else {
                            return { renderBody: 'REVIEWER_LOOKING_AT_APPLICATION' }
                        }
                    }
                }
                else {
                    if (task.validRoles.length > 0 && !task.archivedAt && !task.deletedAt) {
                        if (amIEligible(task) || amIEligibleDiscord(task)) {
                            if (task.isSingleContributor) {
                                return { renderBody: 'FITS_YOUR_ROLE_APPLY' }
                            }
                            else {
                                return { renderBody: 'FITS_YOUR_ROLE_SUBMIT' }
                            }
                        }
                        else {
                            return { renderBody: 'DOES_NOT_FIT_YOUR_ROLE' }
                        }
                    }
                    else if (!task.archivedAt && !task.deletedAt) {
                        if (task.isSingleContributor) {
                            return { renderBody: 'TASK_NEEDS_CONTRIBUTOR' }
                        }
                        else {
                            return { renderBody: 'OPEN_FOR_ALL' }
                        }
                    }
                }
            }
        }
        else if (task.taskStatus === 'assigned' && !task.archivedAt && !task.deletedAt) {
            if (amIApproved(task)) {
                return { renderBody: 'YOU_ARE_ASSIGNED' }
            }
            else {
                if (amIRejected(task)) {
                    return { renderBody: 'SUBMISSION_REJECTED' }
                }
                else {
                    return { renderBody: 'USER_ASSIGNED' }
                }
            }
        }
        else if (task.taskStatus === 'submitted' && !task.archivedAt && !task.deletedAt) {
            if (amIApproved(task)) {
                return { renderBody: 'WAITING_FOR_VALIDATION' }
            }
            else {
                return { renderBody: 'TASK_SUBMITTED' }
            }
        }
        else if ((task.taskStatus === 'approved' || task.taskStatus === 'paid') && !task.archivedAt && !task.deletedAt) {
            if (amIApproved(task)) {
                return { renderBody: 'WELL_DONE' }
            }
            else {
                return { renderBody: 'TASK_STATUS' }
            }
        }
        else if (task.taskStatus === 'rejected' && !task.archivedAt && !task.deletedAt) {
            if (amIRejected(task)) {
                if (task.reopenedAt) {
                    return { renderBody: 'SUBMISSION_REJECTED' }
                }
                else {
                    return { renderBody: 'SUBMISSION_REJECTED_SUBMIT_AGAIN' }
                }
            }
            else {
                return { renderBody: 'SUBMISSION_STATUS' }
            }
        }
        return { renderBody: null }
    }

    const transformTask = (task: any) => {
        return {
            ...task,
            visual: {
                ...getTaskStatus(task),
                ...getTaskBody(task)
            }
        }
    }


    return {
        amIApplicant,
        hasMySubmission,
        isMySubmissionAccepted,
        amIApproved,
        amIRejected,
        getRejectionNote,
        amIEligible,
        amIEligibleDiscord,
        amICreator,
        assignedUser,
        taskMembers,
        transformTask
    }

}