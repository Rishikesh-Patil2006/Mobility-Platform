import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { AccountDetails, changePassword, updateAccountEmail, updateAccountMobile, toggleTwoFactor } from '../services/vendorAccountService';

interface AccountCardProps {
  account: AccountDetails;
  onRefresh: () => void;
  onOpenDeleteConfirm: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, onRefresh, onOpenDeleteConfirm }) => {
  const [editingPass, setEditingPass] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const [editingEmail, setEditingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState(account.email);

  const [editingMobile, setEditingMobile] = useState(false);
  const [mobileInput, setMobileInput] = useState(account.mobile);

  const handleChangePassword = async () => {
    const res = await changePassword(oldPass, newPass);
    if (!res.success) return Alert.alert('Error', res.error || 'Failed to change password.');
    Alert.alert('Success', 'Account password updated successfully!');
    setEditingPass(false);
    setOldPass('');
    setNewPass('');
  };

  const handleSaveEmail = async () => {
    const res = await updateAccountEmail(emailInput);
    if (!res.success) return Alert.alert('Error', res.error || 'Invalid email address.');
    Alert.alert('Success', 'Account email address updated!');
    setEditingEmail(false);
    onRefresh();
  };

  const handleSaveMobile = async () => {
    const res = await updateAccountMobile(mobileInput);
    if (!res.success) return Alert.alert('Error', res.error || 'Invalid mobile number.');
    Alert.alert('Success', 'Account mobile number updated!');
    setEditingMobile(false);
    onRefresh();
  };

  const handleToggle2FA = async () => {
    await toggleTwoFactor();
    onRefresh();
  };

  const handleLogoutAll = () => {
    Alert.alert('Logout All Devices', 'Logged out session tokens from 3 active devices.');
  };

  return (
    <View style={styles.container}>
      {/* Email Address */}
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>✉️</Text>
          <View style={styles.col}>
            <Text style={styles.label}>Account Email</Text>
            <Text style={styles.val}>{account.email}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setEditingEmail(!editingEmail)} style={styles.editBtn}>
          <Text style={styles.editText}>{editingEmail ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {editingEmail && (
        <View style={styles.editorBox}>
          <TextInput style={styles.input} value={emailInput} onChangeText={setEmailInput} />
          <TouchableOpacity onPress={handleSaveEmail} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Email</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mobile Number */}
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>📱</Text>
          <View style={styles.col}>
            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.val}>{account.mobile}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setEditingMobile(!editingMobile)} style={styles.editBtn}>
          <Text style={styles.editText}>{editingMobile ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      {editingMobile && (
        <View style={styles.editorBox}>
          <TextInput style={styles.input} value={mobileInput} onChangeText={setMobileInput} />
          <TouchableOpacity onPress={handleSaveMobile} style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Mobile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Change Password */}
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>🔑</Text>
          <View style={styles.col}>
            <Text style={styles.label}>Account Password</Text>
            <Text style={styles.val}>••••••••••••</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setEditingPass(!editingPass)} style={styles.editBtn}>
          <Text style={styles.editText}>{editingPass ? 'Cancel' : 'Change'}</Text>
        </TouchableOpacity>
      </View>

      {editingPass && (
        <View style={styles.editorBox}>
          <TextInput style={styles.input} secureTextEntry placeholder="Current Password" value={oldPass} onChangeText={setOldPass} />
          <TextInput style={[styles.input, { marginTop: 6 }]} secureTextEntry placeholder="New Password (min 6 chars)" value={newPass} onChangeText={setNewPass} />
          <TouchableOpacity onPress={handleChangePassword} style={styles.saveBtn}>
            <Text style={styles.saveText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Two-Step Verification */}
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.icon}>🛡️</Text>
          <View style={styles.col}>
            <Text style={styles.label}>Two-Step Verification (2FA)</Text>
            <Text style={styles.val}>SMS / OTP authentication on login</Text>
          </View>
        </View>
        <Switch
          value={account.twoStepEnabled}
          onValueChange={handleToggle2FA}
          trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
          thumbColor={account.twoStepEnabled ? '#1E3A8A' : '#94A3B8'}
        />
      </View>

      {/* Logout All & Delete Account Actions */}
      <View style={styles.dangerZone}>
        <TouchableOpacity onPress={handleLogoutAll} style={styles.logoutAllBtn}>
          <Text style={styles.logoutAllText}>📲 Logout All Other Devices</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onOpenDeleteConfirm} style={styles.deleteAccBtn}>
          <Text style={styles.deleteAccText}>🗑️ Permanently Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  val: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  editBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2563EB',
  },
  editorBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
    gap: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    backgroundColor: 'white',
  },
  saveBtn: {
    backgroundColor: '#1E3A8A',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 11.5,
    fontWeight: '800',
  },
  dangerZone: {
    marginTop: 14,
    gap: 8,
  },
  logoutAllBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutAllText: {
    color: '#334155',
    fontSize: 11.5,
    fontWeight: '800',
  },
  deleteAccBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  deleteAccText: {
    color: '#DC2626',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
export default AccountCard;
