import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { AppScreen } from '@/components'
import colors from '@/configs/colors'
import SearchIcon from '@/assets/icons/Search.svg'
import fonts from '@/configs/fonts'
import { SectionList } from 'react-native'
import { transactionHistory } from '@/api/payment.api'
import { useAppPersistStore } from '@/store/zustand.store'
import { ITransactionHistory } from '@/types/api/payment.type'
import ToastNotification from '@/components/ToastNotifications'
import { formatToMonthDayYear, formatToTime } from '@/Utils/formatTime'
import getSymbolFromCurrency from 'currency-symbol-map'
import { truncateText } from '@/Utils/textUtils'
import { formatAmount } from '@/Utils/formatAmount'

const TransactionHistory = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<ITransactionHistory[]>([])
    const [filteredTransactions, setFilteredTransactions] = useState<ITransactionHistory[]>([])
      const [page, setPage] = useState<number>(1);
      const [hasMore, setHasMore] = useState<boolean>(true);
      const {setIsToken, isToken} = useAppPersistStore();
      const [searchText, setSearchText] = useState('');
  
     async function handleGetTransaction(page?: number) {
      try {
        setLoading(true);
        const res = await transactionHistory({page: page ?? 1, limit: 20});
        if (res.data?.status === 401) setIsToken(true);
        if (res.ok && res.data) {
          const data = res.data.data
           const newTransactions = data.map(transaction => {
        let message = '';
        const { useCase, liveDetails, videoDetails, votePaymentDetails } = transaction;

        if (useCase === 'donate') {
          message = `Donate for ${liveDetails?.title}`;
        } else if (useCase === 'vote') {
          message = `${votePaymentDetails?.quantity} votes for ${votePaymentDetails?.contestantName}`;
        } else if (useCase.includes('watch')) {
          message = `Paid for ${liveDetails?.title || videoDetails?.title}`;
        } else {
          message = useCase;
        }
        return {
          ...transaction,
          message,
        };
      });
          
          setTransactions(prev =>{
            const existing = new Set(prev.map(x => x._id));
            const merged = [
              ...prev,
              ...newTransactions.filter(x => !existing.has(x._id)),
            ];
            if (merged.length === prev.length) setHasMore(false);

            return merged
          })
          if (page) setPage(page);
        } else {
          ToastNotification('error', `${res.data?.message}`);
          setHasMore(false);
        }
      } catch (error) {
        ToastNotification('error',`${error}`);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }
  
    const loadMore = useCallback(() => {
      if(searchText.length > 0) return;
      if (!hasMore || transactions.length < 20) return;
      handleGetTransaction(transactions.length >= page * 20 ? page + 1 : page);
    }, [page, hasMore]);

   function handleFilterTransaction(query: string) {
  if (!query) {
    setFilteredTransactions(transactions);
    return;
  }
  
  const lowerCaseQuery = query.toLowerCase();
  const filtered = transactions.filter(transaction =>
    transaction?.message?.toLowerCase().includes(lowerCaseQuery)
  );

  setFilteredTransactions(filtered);
}

    useEffect(() =>{
      handleGetTransaction(1)
    }, []);

   const groupedTransations = (searchText.length > 0 ? filteredTransactions : transactions).reduce((acc, item) => {
       const date = new Date(item.createdAt).toISOString().split('T')[0];
       if (!acc[date]) acc[date] = [];
       acc[date].push(item);
       return acc;
     }, {} as Record<string, ITransactionHistory[]>);
   
     const sections = Object.entries(groupedTransations,
     ).map(([date, data]) => ({title: date, data}));

  return (
    <AppScreen containerStyle={{ paddingTop: 20, paddingHorizontal:0 }}>
    <View className='px-5'>

      <Text className='font-ROBOTO_700 text-white text-2xl mb-1 mt-2'>History</Text>

       <View
            className="flex-row items-center bg-[#262A33] rounded-md px-3 py-[3.5px] my-3 mb-4">
            <TouchableOpacity className="mr-2">
              <SearchIcon />
            </TouchableOpacity>
            <TextInput
              placeholder="Search"
              placeholderTextColor={'#9095A0'}
              style={styles.input}
              onChangeText={handleFilterTransaction}
            />
          </View>

    </View>
           <SectionList
        sections={sections}
        keyExtractor={(_,index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:50}}
        onEndReachedThreshold={1}
        onEndReached={loadMore}
        renderSectionHeader={({section: {title}}) => {
          return (
            <View className='bg-[#171A1F80] h-[30px] px-6 mb-1 mt-3 justify-center'>
                <Text style={{fontFamily:fonts.INTER_400}} className='text-xs text-[#BCC1CA]'>{formatToMonthDayYear(title)}</Text>
            </View>
          );
        }}
        renderItem={({item}) => {
            return (
                <View className='w-[85%] my-3 mb-3 ml-auto pr-6'>
                    <View className='flex-row items-center justify-between'>
                      <Text style={{fontFamily:fonts.INTER_700}} className='text-white text-sm capitalize'>{item.message}</Text>
                      <Text style={{fontFamily:fonts.INTER_700}} className='text-white text-sm'>{getSymbolFromCurrency(item.currency)}{formatAmount(item.amount.toString())}</Text>
                    </View>
                    <View className='flex-row items-center justify-between mt-1.5'>
                      <Text style={{color: item.status.toLowerCase() === 'failed' ?'#FF1313' : item.status.toLowerCase() === 'success' ? '#117B34': '#F3C63F'}} className='text-[10px] font-MANROPE_400 capitalize'>{item.status}</Text>
                      <Text className='text-[10px] text-[#9095A0] font-MANROPE_400'>{formatToTime(item.createdAt)}</Text>
                      <Text className='text-[10px] text-[#9095A0] font-MANROPE_400'>TransactionId: {truncateText(16,item._id)}</Text>
                    </View>
                </View>
            )
        }}
        ListFooterComponent={
          <>
            {loading && transactions.length > 10 && (
              <View className="h-20 items-center justify-center">
                <ActivityIndicator size={'large'} />
              </View>
            )}
          </>
        }
      />
    </AppScreen>
  )
}

export default TransactionHistory

const styles = StyleSheet.create({
    input: {
        fontFamily:fonts.INTER_400,
        fontSize:15,
        color: colors.WHITE
    }
})